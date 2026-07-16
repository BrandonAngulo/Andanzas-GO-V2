-- La interfaz ya consumía question_reports, pero la tabla no existía en producción.
CREATE TABLE IF NOT EXISTS public.question_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.game_questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','open','resolved','dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS question_reports_status_created_idx ON public.question_reports(status,created_at DESC);
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can report questions" ON public.question_reports;
CREATE POLICY "Authenticated users can report questions" ON public.question_reports FOR INSERT TO authenticated
  WITH CHECK(user_id IS NULL OR user_id=(SELECT auth.uid()));
DROP POLICY IF EXISTS "Anonymous users can report questions" ON public.question_reports;
CREATE POLICY "Anonymous users can report questions" ON public.question_reports FOR INSERT TO anon WITH CHECK(user_id IS NULL);
DROP POLICY IF EXISTS "Staff can read question reports" ON public.question_reports;
CREATE POLICY "Staff can read question reports" ON public.question_reports FOR SELECT TO authenticated USING(public.is_staff());
DROP POLICY IF EXISTS "Staff can update question reports" ON public.question_reports;
CREATE POLICY "Staff can update question reports" ON public.question_reports FOR UPDATE TO authenticated
  USING(public.is_staff()) WITH CHECK(public.is_staff());
GRANT INSERT ON public.question_reports TO anon,authenticated;
GRANT SELECT,UPDATE ON public.question_reports TO authenticated;
