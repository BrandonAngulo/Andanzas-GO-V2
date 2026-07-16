-- Registra únicamente las vidas realmente añadidas cuando una compra alcanza el máximo.
CREATE OR REPLACE FUNCTION public.purchase_game_item(offer_key text, request_key text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=auth.uid(); w public.user_wallets%ROWTYPE; offer public.game_shop_offers%ROWTYPE;
  idem text; actual_added integer;
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
  actual_added:=least(offer.item_quantity,w.max_lives-w.lives);
  UPDATE public.user_wallets SET
    coins=coins-CASE WHEN offer.price_currency='coin' THEN offer.price_amount ELSE 0 END,
    gems=gems-CASE WHEN offer.price_currency='gem' THEN offer.price_amount ELSE 0 END,
    lives=lives+actual_added,
    next_life_at=CASE WHEN lives+actual_added>=max_lives THEN NULL ELSE coalesce(next_life_at,now()+interval '4 hours') END,
    updated_at=now() WHERE user_id=uid RETURNING * INTO w;
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(uid,offer.price_currency,-offer.price_amount,CASE WHEN offer.price_currency='coin' THEN w.coins ELSE w.gems END,
      'Compra: '||offer.title,'game_shop',offer.offer_key,idem,jsonb_build_object('lives_added',actual_added));
  INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(uid,'life',actual_added,w.lives,'Compra: '||offer.title,'game_shop',offer.offer_key,idem||':life','{}'::jsonb);
  RETURN public.get_my_economy_summary(uid)||jsonb_build_object('success',true,'purchased_lives',actual_added);
END;
$$;

REVOKE ALL ON FUNCTION public.purchase_game_item(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.purchase_game_item(text,text) TO authenticated;
