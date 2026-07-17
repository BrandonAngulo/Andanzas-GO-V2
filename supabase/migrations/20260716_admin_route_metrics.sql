-- Incorpora rutas, avance e inscripciones al tablero consolidado.

CREATE OR REPLACE FUNCTION public.get_admin_management_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=''
AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.is_staff() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT jsonb_build_object(
    'users',jsonb_build_object(
      'total',(SELECT count(*) FROM public.profiles),
      'suspended',(SELECT count(*) FROM public.profiles WHERE status='banned'),
      'active_today',(SELECT count(DISTINCT user_id) FROM public.user_sessions WHERE user_id IS NOT NULL AND started_at>=date_trunc('day',now())),
      'active_7d',(SELECT count(DISTINCT user_id) FROM public.user_sessions WHERE user_id IS NOT NULL AND started_at>=now()-interval '7 days'),
      'average_level',(SELECT coalesce(round(avg(level),1),0) FROM public.profiles),
      'average_xp',(SELECT coalesce(round(avg(experience_points)),0) FROM public.profiles)
    ),
    'activity',jsonb_build_object(
      'sessions',(SELECT count(*) FROM public.user_sessions),
      'events',(SELECT count(*) FROM public.analytics_events),
      'events_7d',(SELECT count(*) FROM public.analytics_events WHERE created_at>=now()-interval '7 days'),
      'top_events',(SELECT coalesce(jsonb_agg(x ORDER BY x.count DESC),'[]'::jsonb) FROM
        (SELECT event_name AS name,count(*) AS count FROM public.analytics_events GROUP BY event_name ORDER BY count(*) DESC LIMIT 8) x)
    ),
    'games',jsonb_build_object(
      'sessions',(SELECT count(*) FROM public.game_sessions),
      'completed',(SELECT count(*) FROM public.game_sessions WHERE status='completed'),
      'active',(SELECT count(*) FROM public.game_sessions WHERE status='active'),
      'average_accuracy',(SELECT coalesce(round(avg(accuracy_percent),1),0) FROM public.game_sessions WHERE status='completed'),
      'questions_published',(SELECT count(*) FROM public.game_questions WHERE status='published'),
      'questions_review',(SELECT count(*) FROM public.game_questions WHERE status='review'),
      'questions_draft',(SELECT count(*) FROM public.game_questions WHERE status='draft'),
      'reports_open',(SELECT count(*) FROM public.question_reports WHERE status IN ('pending','open'))
    ),
    'routes',jsonb_build_object(
      'total',(SELECT count(*) FROM public.routes),
      'active_progress',(SELECT count(*) FROM public.user_route_progress WHERE status='in_progress'),
      'completed_progress',(SELECT count(*) FROM public.user_route_progress WHERE status='completed'),
      'confirmed_registrations',(SELECT count(*) FROM public.route_registrations WHERE status='confirmed'),
      'waitlist_registrations',(SELECT count(*) FROM public.route_registrations WHERE status='waitlist'),
      'custom_requests_open',(SELECT count(*) FROM public.custom_route_requests WHERE status NOT IN ('completed','canceled','rejected'))
    ),
    'economy',jsonb_build_object(
      'points_in_wallets',(SELECT coalesce(sum(app_points),0) FROM public.user_wallets),
      'coins_in_wallets',(SELECT coalesce(sum(coins),0) FROM public.user_wallets),
      'gems_in_wallets',(SELECT coalesce(sum(gems),0) FROM public.user_wallets),
      'available_lives',(SELECT coalesce(sum(lives),0) FROM public.user_wallets),
      'transactions_30d',(SELECT count(*) FROM public.economy_transactions WHERE created_at>=now()-interval '30 days'),
      'shop_purchases_30d',(SELECT count(*) FROM public.economy_transactions WHERE source_type='game_shop' AND currency IN ('coin','gem') AND created_at>=now()-interval '30 days'),
      'gems_awarded_30d',(SELECT coalesce(sum(amount),0) FROM public.economy_transactions WHERE currency='gem' AND amount>0 AND created_at>=now()-interval '30 days'),
      'coins_awarded_30d',(SELECT coalesce(sum(amount),0) FROM public.economy_transactions WHERE currency='coin' AND amount>0 AND created_at>=now()-interval '30 days')
    )
  ) INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_management_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_management_metrics() TO authenticated;
