-- Economía de vidas: XP no canjeable, 1 gema equivale a 20 monedas como referencia.
-- Las vidas se regeneran de una en una cada 4 horas, hasta un máximo de 5.

ALTER TABLE public.user_wallets
  ADD COLUMN IF NOT EXISTS lives integer NOT NULL DEFAULT 5 CHECK (lives >= 0),
  ADD COLUMN IF NOT EXISTS max_lives integer NOT NULL DEFAULT 5 CHECK (max_lives BETWEEN 1 AND 20),
  ADD COLUMN IF NOT EXISTS next_life_at timestamptz;

UPDATE public.user_wallets SET lives = 5, max_lives = 5 WHERE lives < 5;

ALTER TABLE public.economy_transactions DROP CONSTRAINT IF EXISTS economy_transactions_currency_check;
ALTER TABLE public.economy_transactions ADD CONSTRAINT economy_transactions_currency_check
  CHECK (currency IN ('profile_xp', 'app_point', 'coin', 'gem', 'life'));

CREATE TABLE IF NOT EXISTS public.economy_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_shop_offers (
  offer_key text PRIMARY KEY,
  title text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('life')),
  item_quantity integer NOT NULL CHECK (item_quantity > 0),
  price_currency text NOT NULL CHECK (price_currency IN ('coin', 'gem')),
  price_amount integer NOT NULL CHECK (price_amount > 0),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.economy_settings(key,value,description) VALUES
 ('gem_coin_reference_value','20','Equivalencia de referencia; no habilita cambio libre entre monedas.'),
 ('life_recharge_minutes','240','Una vida se recupera cada cuatro horas.'),
 ('default_max_lives','5','Capacidad normal de vidas.')
ON CONFLICT (key) DO UPDATE SET value=excluded.value, description=excluded.description, updated_at=now();

INSERT INTO public.game_shop_offers(offer_key,title,item_type,item_quantity,price_currency,price_amount,sort_order) VALUES
 ('life_1_coin','1 vida','life',1,'coin',20,10),
 ('life_3_coin','Combo de 3 vidas','life',3,'coin',50,20),
 ('life_1_gem','1 vida','life',1,'gem',1,30),
 ('life_3_gem','Combo de 3 vidas','life',3,'gem',2,40)
ON CONFLICT (offer_key) DO UPDATE SET title=excluded.title,item_quantity=excluded.item_quantity,
 price_currency=excluded.price_currency,price_amount=excluded.price_amount,sort_order=excluded.sort_order,active=true,updated_at=now();

ALTER TABLE public.economy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_shop_offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read economy settings" ON public.economy_settings;
CREATE POLICY "Anyone can read economy settings" ON public.economy_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can read active shop offers" ON public.game_shop_offers;
CREATE POLICY "Anyone can read active shop offers" ON public.game_shop_offers FOR SELECT USING (active);
GRANT SELECT ON public.economy_settings, public.game_shop_offers TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.economy_settings, public.game_shop_offers FROM anon, authenticated;

CREATE OR REPLACE FUNCTION economy.refresh_lives(target_user uuid)
RETURNS public.user_wallets
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE wallet public.user_wallets%ROWTYPE; recharge_seconds integer := 14400; recovered integer;
BEGIN
  INSERT INTO public.user_wallets(user_id) VALUES(target_user) ON CONFLICT(user_id) DO NOTHING;
  SELECT * INTO wallet FROM public.user_wallets WHERE user_id=target_user FOR UPDATE;
  IF wallet.lives >= wallet.max_lives THEN
    UPDATE public.user_wallets SET lives=max_lives,next_life_at=NULL,updated_at=now() WHERE user_id=target_user RETURNING * INTO wallet;
  ELSIF wallet.next_life_at IS NULL THEN
    UPDATE public.user_wallets SET next_life_at=now()+make_interval(secs=>recharge_seconds),updated_at=now() WHERE user_id=target_user RETURNING * INTO wallet;
  ELSIF wallet.next_life_at <= now() THEN
    recovered := 1 + floor(extract(epoch FROM (now()-wallet.next_life_at))/recharge_seconds)::integer;
    UPDATE public.user_wallets SET
      lives=least(max_lives,lives+recovered),
      next_life_at=CASE WHEN lives+recovered >= max_lives THEN NULL ELSE next_life_at+make_interval(secs=>recovered*recharge_seconds) END,
      updated_at=now()
    WHERE user_id=target_user RETURNING * INTO wallet;
  END IF;
  RETURN wallet;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_economy_summary(target_user uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE p public.profiles%ROWTYPE; w public.user_wallets%ROWTYPE; offers jsonb;
BEGIN
  IF target_user IS NULL OR target_user <> auth.uid() THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id=target_user;
  w := economy.refresh_lives(target_user);
  SELECT coalesce(jsonb_agg(jsonb_build_object('key',offer_key,'title',title,'quantity',item_quantity,
    'currency',price_currency,'price',price_amount) ORDER BY sort_order),'[]'::jsonb)
    INTO offers FROM public.game_shop_offers WHERE active;
  RETURN jsonb_build_object(
    'level',p.level,'experience_points',p.experience_points,
    'level_start_xp',(100*(greatest(p.level,1)-1)*(greatest(p.level,1)-1))::bigint,
    'next_level_xp',(100*greatest(p.level,1)*greatest(p.level,1))::bigint,
    'app_points',w.app_points,'coins',w.coins,'gems',w.gems,
    'lives',w.lives,'max_lives',w.max_lives,'next_life_at',w.next_life_at,
    'gem_coin_reference_value',20,'life_recharge_minutes',240,'shop_offers',offers);
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_game_life(game_session_id uuid, question_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=auth.uid(); w public.user_wallets%ROWTYPE; idem text:='life-use:'||game_session_id||':'||question_id;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.game_sessions gs WHERE gs.id=game_session_id AND gs.user_id=uid AND gs.status='active') THEN
    RAISE EXCEPTION 'Active session not found';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public.game_answers ga WHERE ga.session_id=game_session_id AND ga.question_id=consume_game_life.question_id AND ga.is_correct=false) THEN
    RAISE EXCEPTION 'A failed answer is required';
  END IF;
  IF EXISTS(SELECT 1 FROM public.economy_transactions WHERE user_id=uid AND idempotency_key=idem) THEN
    w:=economy.refresh_lives(uid); RETURN jsonb_build_object('success',true,'lives',w.lives,'next_life_at',w.next_life_at);
  END IF;
  w:=economy.refresh_lives(uid);
  IF w.lives <= 0 THEN RAISE EXCEPTION 'NO_LIVES'; END IF;
  UPDATE public.user_wallets SET lives=lives-1,
    next_life_at=coalesce(next_life_at,now()+interval '4 hours'),updated_at=now()
    WHERE user_id=uid RETURNING * INTO w;
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key)
    VALUES(uid,'life',-1,w.lives,'Vida usada en una partida','game_answer',question_id::text,idem);
  RETURN jsonb_build_object('success',true,'lives',w.lives,'max_lives',w.max_lives,'next_life_at',w.next_life_at);
END;
$$;

CREATE OR REPLACE FUNCTION public.purchase_game_item(offer_key text, request_key text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=auth.uid(); w public.user_wallets%ROWTYPE; offer public.game_shop_offers%ROWTYPE; idem text;
BEGIN
  IF uid IS NULL OR request_key IS NULL OR length(request_key)<8 THEN RAISE EXCEPTION 'Invalid request'; END IF;
  SELECT * INTO offer FROM public.game_shop_offers WHERE game_shop_offers.offer_key=purchase_game_item.offer_key AND active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Offer not found'; END IF;
  idem:='shop:'||request_key;
  IF EXISTS(SELECT 1 FROM public.economy_transactions WHERE user_id=uid AND idempotency_key=idem) THEN
    RETURN public.get_my_economy_summary(uid);
  END IF;
  w:=economy.refresh_lives(uid);
  IF w.lives >= w.max_lives THEN RAISE EXCEPTION 'LIVES_FULL'; END IF;
  IF offer.price_currency='coin' AND w.coins<offer.price_amount THEN RAISE EXCEPTION 'INSUFFICIENT_COINS'; END IF;
  IF offer.price_currency='gem' AND w.gems<offer.price_amount THEN RAISE EXCEPTION 'INSUFFICIENT_GEMS'; END IF;
  UPDATE public.user_wallets SET
    coins=coins-CASE WHEN offer.price_currency='coin' THEN offer.price_amount ELSE 0 END,
    gems=gems-CASE WHEN offer.price_currency='gem' THEN offer.price_amount ELSE 0 END,
    lives=least(max_lives,lives+offer.item_quantity),
    next_life_at=CASE WHEN least(max_lives,lives+offer.item_quantity)>=max_lives THEN NULL ELSE coalesce(next_life_at,now()+interval '4 hours') END,
    updated_at=now() WHERE user_id=uid RETURNING * INTO w;
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(uid,offer.price_currency,-offer.price_amount,CASE WHEN offer.price_currency='coin' THEN w.coins ELSE w.gems END,
      'Compra: '||offer.title,'game_shop',offer.offer_key,idem,jsonb_build_object('lives_added',offer.item_quantity));
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(uid,'life',least(offer.item_quantity,w.max_lives-(w.lives-offer.item_quantity)),w.lives,
      'Compra: '||offer.title,'game_shop',offer.offer_key,idem||':life','{}'::jsonb);
  RETURN public.get_my_economy_summary(uid)||jsonb_build_object('success',true,'purchased_lives',offer.item_quantity);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_game_life(uuid,uuid), public.purchase_game_item(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.consume_game_life(uuid,uuid), public.purchase_game_item(text,text) TO authenticated;
REVOKE ALL ON FUNCTION public.get_my_economy_summary(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_my_economy_summary(uuid) TO authenticated;
