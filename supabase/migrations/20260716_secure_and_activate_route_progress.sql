-- Convierte user_route_progress en la fuente persistente del avance de rutas.
-- Sustituye los permisos amplios heredados por una frontera explícita por usuario.

REVOKE ALL ON public.user_route_progress FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_route_progress TO authenticated;

DROP POLICY IF EXISTS "Users can manage own route progress" ON public.user_route_progress;
DROP POLICY IF EXISTS "Users can read own route progress" ON public.user_route_progress;
DROP POLICY IF EXISTS "Users can insert own route progress" ON public.user_route_progress;
DROP POLICY IF EXISTS "Users can update own route progress" ON public.user_route_progress;

CREATE POLICY "Users can read own route progress"
ON public.user_route_progress FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own route progress"
ON public.user_route_progress FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own route progress"
ON public.user_route_progress FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.stamp_user_route_progress()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.status = 'in_progress' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'in_progress') THEN
    NEW.started_at := coalesce(NEW.started_at, now());
  END IF;
  IF NEW.status = 'completed' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'completed') THEN
    NEW.completed_at := coalesce(NEW.completed_at, now());
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.stamp_user_route_progress() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS stamp_user_route_progress_trigger ON public.user_route_progress;
CREATE TRIGGER stamp_user_route_progress_trigger
BEFORE INSERT OR UPDATE ON public.user_route_progress
FOR EACH ROW EXECUTE FUNCTION public.stamp_user_route_progress();
