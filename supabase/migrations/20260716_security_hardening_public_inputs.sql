-- Endurecimiento conservador de entradas públicas y funciones privilegiadas.
-- No elimina tablas ni registros y mantiene las funcionalidades activas.

-- Las funciones de trigger no deben ser endpoints públicos.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- La palabra del día requiere una sesión y ya valida auth.uid() internamente.
ALTER FUNCTION public.claim_word_of_the_day() SET search_path = '';
REVOKE ALL ON FUNCTION public.claim_word_of_the_day() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_word_of_the_day() TO authenticated;

-- La analítica sigue admitiendo visitantes anónimos, con identidad coherente
-- y límites que evitan cargas arbitrarias o suplantación de usuarios.
DROP POLICY IF EXISTS "Anyone can insert events (anonymous allowed)" ON public.analytics_events;
CREATE POLICY "Validated analytics event inserts"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(event_name) BETWEEN 1 AND 80
  AND session_id IS NOT NULL
  AND length(session_id) BETWEEN 16 AND 128
  AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
  AND (entity_type IS NULL OR length(entity_type) <= 80)
  AND (entity_id IS NULL OR length(entity_id) <= 160)
  AND (metadata IS NULL OR (jsonb_typeof(metadata) = 'object' AND octet_length(metadata::text) <= 16384))
);

-- Una sesión pública debe usar el UUID generado por la aplicación. Los datos
-- autenticados solo pueden atribuirse a la persona de la sesión actual.
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.user_sessions;
CREATE POLICY "Validated session inserts"
ON public.user_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
  AND (device_type IS NULL OR length(device_type) <= 255)
  AND (city_context IS NULL OR length(city_context) <= 100)
  AND ended_at IS NULL
  AND duration_seconds IS NULL
);

DROP POLICY IF EXISTS "Users can update their sessions" ON public.user_sessions;
CREATE POLICY "Users can close own sessions"
ON public.user_sessions
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE UPDATE ON public.user_sessions FROM anon, authenticated;
GRANT UPDATE (ended_at, duration_seconds) ON public.user_sessions TO authenticated;

-- La aplicación vigente usa public.tickets. Se conserva la tabla heredada,
-- pero se cierra su antigua entrada anónima para evitar spam.
DROP POLICY IF EXISTS "Anyone can insert support tickets" ON public.support_tickets;
REVOKE INSERT ON public.support_tickets FROM anon, authenticated;

-- El bucket es público y sus URLs no necesitan una política de listado.
-- El equipo sí necesita SELECT para administrar y reemplazar archivos.
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Staff can read avatars" ON storage.objects;
CREATE POLICY "Staff can read avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND public.is_staff());
