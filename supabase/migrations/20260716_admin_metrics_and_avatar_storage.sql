-- Métricas consolidadas del panel y almacenamiento funcional para avatares.

CREATE OR REPLACE FUNCTION public.get_admin_management_metrics()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
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
REVOKE ALL ON FUNCTION public.get_admin_management_metrics() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_admin_management_metrics() TO authenticated;

-- Corrige las rutas heredadas que no corresponden a los archivos reales del proyecto.
UPDATE public.avatar_presets SET image_url='/images/avatars/exploradora.png' WHERE id='female_explorer';
UPDATE public.avatar_presets SET image_url='/images/avatars/lectora.png' WHERE id='female_reader';
UPDATE public.avatar_presets SET image_url='/images/avatars/salserx.png' WHERE id='neutral_salsa';
UPDATE public.avatar_presets SET image_url='/images/avatars/catadorx.png' WHERE id='neutral_food';

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('avatars','avatars',true,5242880,ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT(id) DO UPDATE SET public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

DROP POLICY IF EXISTS "Staff can upload avatars" ON storage.objects;
CREATE POLICY "Staff can upload avatars" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK(bucket_id='avatars' AND public.is_staff());
DROP POLICY IF EXISTS "Staff can update avatars" ON storage.objects;
CREATE POLICY "Staff can update avatars" ON storage.objects FOR UPDATE TO authenticated
  USING(bucket_id='avatars' AND public.is_staff()) WITH CHECK(bucket_id='avatars' AND public.is_staff());
DROP POLICY IF EXISTS "Staff can delete avatars" ON storage.objects;
CREATE POLICY "Staff can delete avatars" ON storage.objects FOR DELETE TO authenticated
  USING(bucket_id='avatars' AND public.is_staff());
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
CREATE POLICY "Public can read avatars" ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='avatars');
