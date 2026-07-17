-- Los juegos requieren una sesión registrada y las rutas recompensan el avance real.

INSERT INTO public.economy_settings(key, value, description)
VALUES
  ('route_stop_points', '10', 'Puntos Andanzas entregados al visitar una parada de una ruta.'),
  ('route_completion_multiplier', '1.5', 'Multiplicador final aplicado a los puntos obtenidos durante la ruta.')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.update_operational_setting(setting_key text, setting_value numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE setting_description text;
BEGIN
  IF NOT public.is_staff() THEN RAISE EXCEPTION 'Staff access required'; END IF;

  CASE setting_key
    WHEN 'custom_route_min_notice_days' THEN
      IF setting_value < 1 OR setting_value > 365 OR setting_value <> trunc(setting_value) THEN
        RAISE EXCEPTION 'Value must be an integer between 1 and 365';
      END IF;
      setting_description := 'Anticipación mínima para solicitar una ruta personalizada.';
    WHEN 'route_stop_points' THEN
      IF setting_value < 0 OR setting_value > 100 OR setting_value <> trunc(setting_value) THEN
        RAISE EXCEPTION 'Value must be an integer between 0 and 100';
      END IF;
      setting_description := 'Puntos Andanzas entregados al visitar una parada de una ruta.';
    WHEN 'route_completion_multiplier' THEN
      IF setting_value < 1 OR setting_value > 3 THEN RAISE EXCEPTION 'Value must be between 1 and 3'; END IF;
      setting_description := 'Multiplicador final aplicado a los puntos obtenidos durante la ruta.';
    ELSE RAISE EXCEPTION 'Setting is not administrable';
  END CASE;

  INSERT INTO public.economy_settings(key, value, description, updated_at)
  VALUES (setting_key, to_jsonb(setting_value), setting_description, now())
  ON CONFLICT (key) DO UPDATE SET value=excluded.value, description=excluded.description, updated_at=now();
END;
$$;

REVOKE ALL ON FUNCTION public.update_operational_setting(text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_operational_setting(text, numeric) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_verified_action_points(action_type text, entity_id text, context_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := auth.uid(); reward integer := 0; reward_reason text;
  normalized_context text := coalesce(context_id, ''); route_row public.routes%ROWTYPE;
  stop_index integer; required_stops integer; claimed_stops integer; route_points integer := 0;
  stop_reward integer := 10; completion_multiplier numeric := 1.5; badge_unlocked boolean := false;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF entity_id IS NULL OR length(entity_id) NOT BETWEEN 1 AND 160 THEN RAISE EXCEPTION 'Invalid entity'; END IF;

  CASE action_type
    WHEN 'favorite' THEN
      IF NOT EXISTS (SELECT 1 FROM public.favorites f WHERE f.user_id=uid AND f.site_id=entity_id) THEN RAISE EXCEPTION 'Favorite not found'; END IF;
      reward:=5; reward_reason:='Sitio agregado a favoritos';
    WHEN 'review' THEN
      IF NOT EXISTS (SELECT 1 FROM public.reviews r WHERE r.id::text=entity_id AND r.user_id=uid) THEN RAISE EXCEPTION 'Review not found'; END IF;
      reward:=20; reward_reason:='Reseña publicada';
    WHEN 'route_stop' THEN
      SELECT * INTO route_row FROM public.routes r WHERE r.id=entity_id AND (r.is_published OR r.status='published');
      IF NOT FOUND OR normalized_context='' OR NOT normalized_context=ANY(route_row.puntos) THEN RAISE EXCEPTION 'Route stop not found'; END IF;
      SELECT coalesce((s.value #>> '{}')::integer,10) INTO stop_reward FROM public.economy_settings s WHERE s.key='route_stop_points';
      reward:=greatest(0,least(100,coalesce(stop_reward,10))); reward_reason:='Parada de ruta visitada';
    WHEN 'route_challenge', 'route_challenge_manual' THEN
      SELECT * INTO route_row FROM public.routes r WHERE r.id=entity_id AND (r.is_published OR r.status='published');
      stop_index:=array_position(route_row.puntos,normalized_context);
      IF route_row.id IS NULL OR stop_index IS NULL THEN RAISE EXCEPTION 'Route challenge not found'; END IF;
      reward:=greatest(0,least(500,coalesce((route_row.gamificacion -> (stop_index-1) ->> 'points_reward')::integer,0)));
      IF action_type='route_challenge_manual' THEN reward:=floor(reward/2.0); END IF;
      reward_reason:=CASE WHEN action_type='route_challenge_manual' THEN 'Reto manual de ruta completado' ELSE 'Reto de ruta completado' END;
    WHEN 'route_complete' THEN
      SELECT * INTO route_row FROM public.routes r WHERE r.id=entity_id AND (r.is_published OR r.status='published');
      IF NOT FOUND THEN RAISE EXCEPTION 'Route not found'; END IF;
      required_stops:=cardinality(route_row.puntos);
      SELECT count(DISTINCT c.context_id) INTO claimed_stops FROM economy.user_action_claims c WHERE c.user_id=uid AND c.action_type='route_stop' AND c.entity_id=entity_id;
      IF required_stops>0 AND claimed_stops<required_stops THEN RAISE EXCEPTION 'Route stops incomplete'; END IF;
      SELECT coalesce(sum(c.points_awarded),0) INTO route_points FROM economy.user_action_claims c
        WHERE c.user_id=uid AND c.entity_id=claim_verified_action_points.entity_id AND c.action_type IN ('route_stop','route_challenge','route_challenge_manual');
      SELECT coalesce((s.value #>> '{}')::numeric,1.5) INTO completion_multiplier FROM public.economy_settings s WHERE s.key='route_completion_multiplier';
      reward:=greatest(0,least(1000,round(route_points*(greatest(1,least(3,coalesce(completion_multiplier,1.5)))-1))::integer));
      reward_reason:='Bono por completar la ruta';
    ELSE RAISE EXCEPTION 'Unsupported action type';
  END CASE;

  INSERT INTO economy.user_action_claims(user_id,action_type,entity_id,context_id,points_awarded)
  VALUES(uid,action_type,entity_id,normalized_context,reward) ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN jsonb_build_object('success',true,'already_claimed',true,'points_awarded',0,'badge_unlocked',false); END IF;

  IF reward>0 THEN
    INSERT INTO public.point_logs(user_id,points,reason) VALUES(uid,reward,reward_reason);
    PERFORM economy.apply_rewards(uid,least(reward,100),reward,0,0,reward_reason,action_type,entity_id,
      'verified-action:'||action_type||':'||entity_id||':'||normalized_context,jsonb_build_object('context_id',nullif(normalized_context,'')));
  END IF;

  IF action_type='route_complete' AND nullif(route_row.reward_badge_id,'') IS NOT NULL
     AND EXISTS(SELECT 1 FROM public.badges b WHERE b.id=route_row.reward_badge_id)
     AND NOT EXISTS(SELECT 1 FROM public.user_badges ub WHERE ub.user_id=uid AND ub.badge_id=route_row.reward_badge_id) THEN
    INSERT INTO public.user_badges(user_id,badge_id) VALUES(uid,route_row.reward_badge_id);
    badge_unlocked:=true;
  END IF;

  RETURN jsonb_build_object('success',true,'already_claimed',false,'points_awarded',reward,'badge_unlocked',badge_unlocked,'badge_id',CASE WHEN badge_unlocked THEN route_row.reward_badge_id ELSE NULL END);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_verified_action_points(text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_verified_action_points(text,text,text) TO authenticated;

-- El catálogo puede seguir siendo visible, pero el banco y el compositor no son anónimos.
DROP POLICY IF EXISTS "Published game questions are public" ON public.game_questions;
REVOKE SELECT ON public.game_questions FROM anon;
REVOKE EXECUTE ON FUNCTION public.compose_game_questions(uuid,uuid,integer,text) FROM anon;

REVOKE SELECT, INSERT, UPDATE ON public.game_sessions FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE ON public.game_sessions TO authenticated;
REVOKE SELECT, INSERT ON public.game_answers FROM PUBLIC, anon;
GRANT SELECT, INSERT ON public.game_answers TO authenticated;

DROP POLICY IF EXISTS "Anonymous users can report questions" ON public.question_reports;
REVOKE INSERT ON public.question_reports FROM anon;
