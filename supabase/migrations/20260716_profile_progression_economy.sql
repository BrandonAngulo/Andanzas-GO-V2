-- Separa la progresión global, los puntos de beneficios y la economía de juegos.
-- La curva global es cuadrática: nivel N comienza en 100 * (N - 1)^2 XP.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS experience_points bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lifetime_points bigint NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.user_wallets (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_points bigint NOT NULL DEFAULT 0 CHECK (app_points >= 0),
  coins bigint NOT NULL DEFAULT 0 CHECK (coins >= 0),
  gems bigint NOT NULL DEFAULT 0 CHECK (gems >= 0),
  lifetime_app_points bigint NOT NULL DEFAULT 0 CHECK (lifetime_app_points >= 0),
  lifetime_coins bigint NOT NULL DEFAULT 0 CHECK (lifetime_coins >= 0),
  lifetime_gems bigint NOT NULL DEFAULT 0 CHECK (lifetime_gems >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.economy_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  currency text NOT NULL CHECK (currency IN ('profile_xp', 'app_point', 'coin', 'gem')),
  amount bigint NOT NULL CHECK (amount <> 0),
  balance_after bigint NOT NULL CHECK (balance_after >= 0),
  reason text NOT NULL,
  source_type text NOT NULL,
  source_id text,
  idempotency_key text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS economy_transactions_idempotency_idx
  ON public.economy_transactions(user_id, currency, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS economy_transactions_user_created_idx
  ON public.economy_transactions(user_id, created_at DESC);

ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economy_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own wallet" ON public.user_wallets;
CREATE POLICY "Users can read own wallet" ON public.user_wallets
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Users can read own economy transactions" ON public.economy_transactions;
CREATE POLICY "Users can read own economy transactions" ON public.economy_transactions
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

REVOKE ALL ON public.user_wallets FROM anon;
REVOKE ALL ON public.economy_transactions FROM anon;
GRANT SELECT ON public.user_wallets TO authenticated;
GRANT SELECT ON public.economy_transactions TO authenticated;

CREATE OR REPLACE FUNCTION public.profile_level_for_xp(total_xp bigint)
RETURNS integer
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
SET search_path = ''
AS $$
  SELECT greatest(1, floor(sqrt(greatest(total_xp, 0)::numeric / 100))::integer + 1)
$$;

CREATE SCHEMA IF NOT EXISTS economy;
REVOKE ALL ON SCHEMA economy FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION economy.apply_rewards(
  target_user uuid,
  xp_delta bigint,
  app_points_delta bigint,
  coins_delta bigint,
  gems_delta bigint,
  reward_reason text,
  reward_source_type text,
  reward_source_id text DEFAULT NULL,
  reward_idempotency_key text DEFAULT NULL,
  reward_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  wallet public.user_wallets%ROWTYPE;
  new_xp bigint;
  new_level integer;
  already_applied boolean;
BEGIN
  IF target_user IS NULL OR xp_delta < 0 OR app_points_delta < 0 OR coins_delta < 0 OR gems_delta < 0 THEN
    RAISE EXCEPTION 'Invalid reward';
  END IF;

  IF reward_idempotency_key IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.economy_transactions
      WHERE user_id = target_user AND idempotency_key = reward_idempotency_key
    ) INTO already_applied;
    IF already_applied THEN
      RETURN public.get_my_economy_summary(target_user);
    END IF;
  END IF;

  INSERT INTO public.user_wallets(user_id)
  VALUES (target_user)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.profiles
  SET experience_points = experience_points + xp_delta,
      lifetime_points = lifetime_points + app_points_delta,
      points = COALESCE(points, 0) + app_points_delta
  WHERE id = target_user
  RETURNING experience_points INTO new_xp;

  IF new_xp IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  new_level := public.profile_level_for_xp(new_xp);
  UPDATE public.profiles SET level = new_level WHERE id = target_user;

  UPDATE public.user_wallets
  SET app_points = app_points + app_points_delta,
      coins = coins + coins_delta,
      gems = gems + gems_delta,
      lifetime_app_points = lifetime_app_points + app_points_delta,
      lifetime_coins = lifetime_coins + coins_delta,
      lifetime_gems = lifetime_gems + gems_delta,
      updated_at = now()
  WHERE user_id = target_user
  RETURNING * INTO wallet;

  IF xp_delta > 0 THEN
    INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(target_user,'profile_xp',xp_delta,new_xp,reward_reason,reward_source_type,reward_source_id,reward_idempotency_key,reward_metadata);
  END IF;
  IF app_points_delta > 0 THEN
    INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(target_user,'app_point',app_points_delta,wallet.app_points,reward_reason,reward_source_type,reward_source_id,reward_idempotency_key,reward_metadata);
  END IF;
  IF coins_delta > 0 THEN
    INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(target_user,'coin',coins_delta,wallet.coins,reward_reason,reward_source_type,reward_source_id,reward_idempotency_key,reward_metadata);
  END IF;
  IF gems_delta > 0 THEN
    INSERT INTO public.economy_transactions(user_id,currency,amount,balance_after,reason,source_type,source_id,idempotency_key,metadata)
    VALUES(target_user,'gem',gems_delta,wallet.gems,reward_reason,reward_source_type,reward_source_id,reward_idempotency_key,reward_metadata);
  END IF;

  RETURN jsonb_build_object(
    'success', true, 'xp_awarded', xp_delta, 'app_points_awarded', app_points_delta,
    'coins_awarded', coins_delta, 'gems_awarded', gems_delta,
    'experience_points', new_xp, 'level', new_level,
    'app_points', wallet.app_points, 'coins', wallet.coins, 'gems', wallet.gems
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_economy_summary(target_user uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'level', p.level,
    'experience_points', p.experience_points,
    'level_start_xp', (100 * (greatest(p.level, 1) - 1) * (greatest(p.level, 1) - 1))::bigint,
    'next_level_xp', (100 * greatest(p.level, 1) * greatest(p.level, 1))::bigint,
    'app_points', coalesce(w.app_points, p.points, 0),
    'coins', coalesce(w.coins, 0),
    'gems', coalesce(w.gems, 0)
  )
  FROM public.profiles p
  LEFT JOIN public.user_wallets w ON w.user_id = p.id
  WHERE p.id = target_user AND target_user = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.award_points(points_to_add integer, reason_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE user_id uuid := auth.uid();
BEGIN
  IF user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF points_to_add < 0 OR points_to_add > 500 THEN RAISE EXCEPTION 'Invalid points amount'; END IF;
  INSERT INTO public.point_logs(user_id, points, reason) VALUES(user_id, points_to_add, reason_text);
  RETURN economy.apply_rewards(user_id, least(points_to_add, 100), points_to_add, 0, 0,
    reason_text, 'app_activity', NULL, NULL, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.award_game_rewards(game_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  authenticated_user uuid := auth.uid();
  session_row public.game_sessions%ROWTYPE;
  xp_reward integer;
  point_reward integer;
  coin_reward integer;
  gem_reward integer;
BEGIN
  IF authenticated_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO session_row FROM public.game_sessions
  WHERE id = game_session_id AND game_sessions.user_id = authenticated_user AND status = 'completed';
  IF NOT FOUND THEN RAISE EXCEPTION 'Completed game session not found'; END IF;

  xp_reward := CASE WHEN coalesce(session_row.total_score,0) <= 0 THEN 2
    ELSE least(100, 10 + round(sqrt(session_row.total_score::numeric) * 1.5)::integer) END;
  point_reward := least(25, greatest(0, floor(coalesce(session_row.total_score,0)::numeric / 100)::integer));
  coin_reward := least(50, greatest(0, round(sqrt(coalesce(session_row.total_score,0)::numeric))::integer));
  gem_reward := CASE WHEN coalesce(session_row.accuracy_percent,0) = 100
                          AND coalesce(session_row.answered_questions,0) >= 10 THEN 1 ELSE 0 END;

  RETURN economy.apply_rewards(authenticated_user, xp_reward, point_reward, coin_reward, gem_reward,
    'Partida completada', 'game_session', game_session_id::text, 'game-session:' || game_session_id::text,
    jsonb_build_object('score', session_row.total_score, 'accuracy', session_row.accuracy_percent));
END;
$$;

REVOKE ALL ON FUNCTION public.award_points(integer,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_points(integer,text) TO authenticated;
REVOKE ALL ON FUNCTION public.award_game_rewards(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_game_rewards(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.get_my_economy_summary(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_economy_summary(uuid) TO authenticated;

-- Recalibración inicial: convierte el historial, en vez de conservar puntajes brutos como XP.
WITH recalculated AS (
  SELECT p.id,
    coalesce(sum(CASE WHEN pl.reason LIKE 'Trivia:%'
      THEN least(100, 10 + round(sqrt(greatest(pl.points,0)::numeric) * 1.5)::integer)
      ELSE least(greatest(pl.points,0),100) END),0)::bigint AS xp,
    coalesce(sum(CASE WHEN pl.reason LIKE 'Trivia:%'
      THEN least(25, greatest(0, floor(pl.points::numeric / 100)::integer))
      ELSE greatest(pl.points,0) END),0)::bigint AS app_points
  FROM public.profiles p LEFT JOIN public.point_logs pl ON pl.user_id = p.id GROUP BY p.id
)
UPDATE public.profiles p SET experience_points = r.xp, points = r.app_points,
  lifetime_points = greatest(p.lifetime_points, r.app_points), level = public.profile_level_for_xp(r.xp)
FROM recalculated r WHERE p.id = r.id;

INSERT INTO public.user_wallets(user_id, app_points, coins, gems, lifetime_app_points, lifetime_coins, lifetime_gems)
SELECT p.id, p.points,
  coalesce((SELECT sum(least(50, greatest(0, round(sqrt(greatest(gs.total_score,0)::numeric))::integer))) FROM public.game_sessions gs WHERE gs.user_id=p.id AND gs.status='completed'),0),
  coalesce((SELECT count(*) FROM public.game_sessions gs WHERE gs.user_id=p.id AND gs.status='completed' AND gs.accuracy_percent=100 AND gs.answered_questions>=10),0),
  p.points,
  coalesce((SELECT sum(least(50, greatest(0, round(sqrt(greatest(gs.total_score,0)::numeric))::integer))) FROM public.game_sessions gs WHERE gs.user_id=p.id AND gs.status='completed'),0),
  coalesce((SELECT count(*) FROM public.game_sessions gs WHERE gs.user_id=p.id AND gs.status='completed' AND gs.accuracy_percent=100 AND gs.answered_questions>=10),0)
FROM public.profiles p
ON CONFLICT (user_id) DO UPDATE SET app_points=excluded.app_points, coins=excluded.coins, gems=excluded.gems,
 lifetime_app_points=excluded.lifetime_app_points, lifetime_coins=excluded.lifetime_coins,
 lifetime_gems=excluded.lifetime_gems, updated_at=now();
