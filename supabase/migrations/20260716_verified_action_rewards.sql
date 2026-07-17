-- Recompensas verificadas e idempotentes para acciones iniciadas desde el cliente.

CREATE TABLE IF NOT EXISTS economy.user_action_claims (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  entity_id text NOT NULL,
  context_id text NOT NULL DEFAULT '',
  points_awarded integer NOT NULL DEFAULT 0 CHECK (points_awarded >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, action_type, entity_id, context_id)
);

ALTER TABLE economy.user_action_claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON economy.user_action_claims FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_verified_action_points(action_type text, entity_id text, context_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := auth.uid();
  reward integer := 0;
  reward_reason text;
  normalized_context text := coalesce(context_id, '');
  route_row public.routes%ROWTYPE;
  stop_index integer;
  required_stops integer;
  claimed_stops integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF entity_id IS NULL OR length(entity_id) NOT BETWEEN 1 AND 160 THEN RAISE EXCEPTION 'Invalid entity'; END IF;

  CASE action_type
    WHEN 'favorite' THEN
      IF NOT EXISTS (SELECT 1 FROM public.favorites f WHERE f.user_id = uid AND f.site_id = entity_id) THEN
        RAISE EXCEPTION 'Favorite not found';
      END IF;
      reward := 5;
      reward_reason := 'Sitio agregado a favoritos';

    WHEN 'review' THEN
      IF NOT EXISTS (SELECT 1 FROM public.reviews r WHERE r.id::text = entity_id AND r.user_id = uid) THEN
        RAISE EXCEPTION 'Review not found';
      END IF;
      reward := 20;
      reward_reason := 'Reseña publicada';

    WHEN 'route_stop' THEN
      SELECT * INTO route_row FROM public.routes r
      WHERE r.id = entity_id AND (r.is_published OR r.status = 'published');
      IF NOT FOUND OR normalized_context = '' OR NOT normalized_context = ANY(route_row.puntos) THEN
        RAISE EXCEPTION 'Route stop not found';
      END IF;
      reward := 0;
      reward_reason := 'Parada de ruta registrada';

    WHEN 'route_challenge', 'route_challenge_manual' THEN
      SELECT * INTO route_row FROM public.routes r
      WHERE r.id = entity_id AND (r.is_published OR r.status = 'published');
      stop_index := array_position(route_row.puntos, normalized_context);
      IF route_row.id IS NULL OR stop_index IS NULL THEN RAISE EXCEPTION 'Route challenge not found'; END IF;
      reward := greatest(0, least(500, coalesce((route_row.gamificacion -> (stop_index - 1) ->> 'points_reward')::integer, 0)));
      IF action_type = 'route_challenge_manual' THEN reward := floor(reward / 2.0); END IF;
      reward_reason := CASE WHEN action_type = 'route_challenge_manual' THEN 'Reto manual de ruta completado' ELSE 'Reto de ruta completado' END;

    WHEN 'route_complete' THEN
      SELECT * INTO route_row FROM public.routes r
      WHERE r.id = entity_id AND (r.is_published OR r.status = 'published');
      IF NOT FOUND THEN RAISE EXCEPTION 'Route not found'; END IF;
      required_stops := cardinality(route_row.puntos);
      SELECT count(DISTINCT c.context_id) INTO claimed_stops
      FROM economy.user_action_claims c
      WHERE c.user_id = uid AND c.action_type = 'route_stop' AND c.entity_id = entity_id;
      IF required_stops > 0 AND claimed_stops < required_stops THEN RAISE EXCEPTION 'Route stops incomplete'; END IF;
      reward := greatest(0, least(500, coalesce(nullif(route_row.points_reward, 0), 100)));
      reward_reason := 'Ruta completada';

    ELSE
      RAISE EXCEPTION 'Unsupported action type';
  END CASE;

  INSERT INTO economy.user_action_claims(user_id, action_type, entity_id, context_id, points_awarded)
  VALUES(uid, action_type, entity_id, normalized_context, reward)
  ON CONFLICT DO NOTHING;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', true, 'already_claimed', true, 'points_awarded', 0);
  END IF;

  IF reward > 0 THEN
    INSERT INTO public.point_logs(user_id, points, reason) VALUES(uid, reward, reward_reason);
    PERFORM economy.apply_rewards(uid, least(reward, 100), reward, 0, 0,
      reward_reason, action_type, entity_id,
      'verified-action:' || action_type || ':' || entity_id || ':' || normalized_context,
      jsonb_build_object('context_id', nullif(normalized_context, '')));
  END IF;

  RETURN jsonb_build_object('success', true, 'already_claimed', false, 'points_awarded', reward);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_verified_action_points(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_verified_action_points(text, text, text) TO authenticated;

-- award_points permanece disponible para composición interna entre funciones,
-- pero deja de ser invocable directamente por una sesión de usuario.
REVOKE ALL ON FUNCTION public.award_points(integer, text) FROM PUBLIC, anon, authenticated;
