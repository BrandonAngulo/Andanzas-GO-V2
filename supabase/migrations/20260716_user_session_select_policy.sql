-- UPDATE con RLS necesita poder seleccionar primero la fila propia.

DROP POLICY IF EXISTS "Users can read own sessions" ON public.user_sessions;
CREATE POLICY "Users can read own sessions"
ON public.user_sessions FOR SELECT TO authenticated
USING (user_id=(SELECT auth.uid()));
