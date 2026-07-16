-- Keep editorial questions and answer keys out of the public Data API.
DROP POLICY IF EXISTS "Public can view game questions" ON public.game_questions;

CREATE POLICY "Published game questions are public"
ON public.game_questions FOR SELECT
TO anon
USING (status = 'published');

CREATE POLICY "Authenticated users can read published game questions"
ON public.game_questions FOR SELECT
TO authenticated
USING (status = 'published');

CREATE POLICY "Staff can read all game questions"
ON public.game_questions FOR SELECT
TO authenticated
USING ((SELECT public.is_staff()));

DROP POLICY IF EXISTS "Admins can insert game questions" ON public.game_questions;
CREATE POLICY "Staff can insert game questions"
ON public.game_questions FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_staff()));

DROP POLICY IF EXISTS "Admins can update game questions" ON public.game_questions;
CREATE POLICY "Staff can update game questions"
ON public.game_questions FOR UPDATE
TO authenticated
USING ((SELECT public.is_staff()))
WITH CHECK ((SELECT public.is_staff()));

REVOKE EXECUTE ON FUNCTION public.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, service_role;
