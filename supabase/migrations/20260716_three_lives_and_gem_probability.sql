-- Tres vidas máximas y gema probabilística con protección de mala suerte.
ALTER TABLE public.user_wallets ALTER COLUMN lives SET DEFAULT 3;
ALTER TABLE public.user_wallets ALTER COLUMN max_lives SET DEFAULT 3;
UPDATE public.user_wallets
SET lives=least(lives,3), max_lives=3,
    next_life_at=CASE WHEN least(lives,3)=3 THEN NULL ELSE coalesce(next_life_at,now()+interval '4 hours') END,
    updated_at=now();

INSERT INTO public.economy_settings(key,value,description) VALUES
 ('default_max_lives','3','Capacidad normal de vidas.'),
 ('gem_base_probability','0.02','Probabilidad base por partida elegible.'),
 ('gem_accuracy_80_bonus','0.03','Bono de probabilidad con precisión de al menos 80%.'),
 ('gem_perfect_bonus','0.05','Bono adicional para partida perfecta de al menos 10 preguntas.'),
 ('gem_pity_games','15','La partida elegible número 15 sin gema la garantiza.')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,description=excluded.description,updated_at=now();

CREATE TABLE IF NOT EXISTS economy.user_game_reward_state (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  eligible_games_since_gem integer NOT NULL DEFAULT 0 CHECK(eligible_games_since_gem>=0),
  total_random_gems bigint NOT NULL DEFAULT 0 CHECK(total_random_gems>=0),
  last_probability numeric(5,4) NOT NULL DEFAULT 0,
  last_roll_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE economy.user_game_reward_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON economy.user_game_reward_state FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION economy.roll_gem_reward(target_user uuid,accuracy numeric,answered integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE state economy.user_game_reward_state%ROWTYPE; chance numeric(5,4):=0; awarded integer:=0; next_count integer;
BEGIN
  INSERT INTO economy.user_game_reward_state(user_id) VALUES(target_user) ON CONFLICT(user_id) DO NOTHING;
  SELECT * INTO state FROM economy.user_game_reward_state WHERE user_id=target_user FOR UPDATE;
  IF coalesce(answered,0)<5 THEN
    RETURN jsonb_build_object('awarded',0,'probability',0,'pity_progress',state.eligible_games_since_gem,'pity_limit',15);
  END IF;
  chance:=0.02;
  IF coalesce(accuracy,0)>=80 THEN chance:=chance+0.03; END IF;
  IF coalesce(accuracy,0)=100 AND answered>=10 THEN chance:=chance+0.05; END IF;
  next_count:=state.eligible_games_since_gem+1;
  IF next_count>=15 OR random()<chance THEN awarded:=1; next_count:=0; END IF;
  UPDATE economy.user_game_reward_state SET eligible_games_since_gem=next_count,
    total_random_gems=total_random_gems+awarded,last_probability=chance,last_roll_at=now(),updated_at=now()
    WHERE user_id=target_user;
  RETURN jsonb_build_object('awarded',awarded,'probability',chance,'pity_progress',next_count,'pity_limit',15);
END;
$$;

CREATE OR REPLACE FUNCTION public.award_game_rewards(game_session_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE authenticated_user uuid:=auth.uid(); session_row public.game_sessions%ROWTYPE;
  xp_reward integer; point_reward integer; coin_reward integer; gem_reward integer; gem_roll jsonb;
BEGIN
  IF authenticated_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO session_row FROM public.game_sessions
    WHERE id=game_session_id AND game_sessions.user_id=authenticated_user AND status='completed';
  IF NOT FOUND THEN RAISE EXCEPTION 'Completed game session not found'; END IF;
  IF EXISTS(SELECT 1 FROM public.economy_transactions WHERE user_id=authenticated_user AND idempotency_key='game-session:'||game_session_id::text) THEN
    RETURN public.get_my_economy_summary(authenticated_user)||jsonb_build_object('success',true,'already_awarded',true);
  END IF;
  xp_reward:=CASE WHEN coalesce(session_row.total_score,0)<=0 THEN 2 ELSE least(100,10+round(sqrt(session_row.total_score::numeric)*1.5)::integer) END;
  point_reward:=least(25,greatest(0,floor(coalesce(session_row.total_score,0)::numeric/100)::integer));
  coin_reward:=least(50,greatest(0,round(sqrt(coalesce(session_row.total_score,0)::numeric))::integer));
  gem_roll:=economy.roll_gem_reward(authenticated_user,session_row.accuracy_percent,session_row.answered_questions);
  gem_reward:=coalesce((gem_roll->>'awarded')::integer,0);
  RETURN economy.apply_rewards(authenticated_user,xp_reward,point_reward,coin_reward,gem_reward,
    'Partida completada','game_session',game_session_id::text,'game-session:'||game_session_id::text,
    jsonb_build_object('score',session_row.total_score,'accuracy',session_row.accuracy_percent,
      'gem_probability',gem_roll->'probability','gem_pity_progress',gem_roll->'pity_progress','gem_pity_limit',15));
END;
$$;
REVOKE ALL ON FUNCTION public.award_game_rewards(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.award_game_rewards(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.purchase_game_item(offer_key text,request_key text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=auth.uid(); w public.user_wallets%ROWTYPE; offer public.game_shop_offers%ROWTYPE; idem text; actual_added integer;
BEGIN
  IF uid IS NULL OR request_key IS NULL OR length(request_key)<8 THEN RAISE EXCEPTION 'Invalid request'; END IF;
  SELECT * INTO offer FROM public.game_shop_offers WHERE game_shop_offers.offer_key=purchase_game_item.offer_key AND active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Offer not found'; END IF;
  idem:='shop:'||request_key;
  IF EXISTS(SELECT 1 FROM public.economy_transactions WHERE user_id=uid AND idempotency_key=idem) THEN RETURN public.get_my_economy_summary(uid); END IF;
  w:=economy.refresh_lives(uid);
  IF w.lives>=w.max_lives THEN RAISE EXCEPTION 'LIVES_FULL'; END IF;
  IF offer.item_quantity>w.max_lives-w.lives THEN RAISE EXCEPTION 'INSUFFICIENT_LIFE_CAPACITY'; END IF;
  IF offer.price_currency='coin' AND w.coins<offer.price_amount THEN RAISE EXCEPTION 'INSUFFICIENT_COINS'; END IF;
  IF offer.price_currency='gem' AND w.gems<offer.price_amount THEN RAISE EXCEPTION 'INSUFFICIENT_GEMS'; END IF;
  actual_added:=offer.item_quantity;
  UPDATE public.user_wallets SET
    coins=coins-CASE WHEN offer.price_currency='coin' THEN offer.price_amount ELSE 0 END,
    gems=gems-CASE WHEN offer.price_currency='gem' THEN offer.price_amount ELSE 0 END,
    lives=lives+actual_added,next_life_at=CASE WHEN lives+actual_added>=max_lives THEN NULL ELSE coalesce(next_life_at,now()+interval '4 hours') END,
    updated_at=now() WHERE user_id=uid RETURNING * INTO w;
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(uid,offer.price_currency,-offer.price_amount,CASE WHEN offer.price_currency='coin' THEN w.coins ELSE w.gems END,
      'Compra: '||offer.title,'game_shop',offer.offer_key,idem,jsonb_build_object('lives_added',actual_added));
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key)
    VALUES(uid,'life',actual_added,w.lives,'Compra: '||offer.title,'game_shop',offer.offer_key,idem||':life');
  RETURN public.get_my_economy_summary(uid)||jsonb_build_object('success',true,'purchased_lives',actual_added);
END;
$$;
REVOKE ALL ON FUNCTION public.purchase_game_item(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.purchase_game_item(text,text) TO authenticated;
