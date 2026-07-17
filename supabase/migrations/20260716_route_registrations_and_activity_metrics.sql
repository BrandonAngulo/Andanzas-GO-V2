-- Inscripciones con cupo, lista de espera y métricas mínimas autenticadas.

ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS requires_registration boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_capacity integer CHECK (max_capacity IS NULL OR max_capacity > 0),
  ADD COLUMN IF NOT EXISTS current_registrations integer NOT NULL DEFAULT 0 CHECK (current_registrations >= 0),
  ADD COLUMN IF NOT EXISTS registration_status text NOT NULL DEFAULT 'open'
    CHECK (registration_status IN ('open','closed','invite_only'));

CREATE TABLE IF NOT EXISTS public.route_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id text NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','waitlist','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  UNIQUE(user_id, route_id)
);

ALTER TABLE public.route_registrations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.route_registrations FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.route_registrations TO authenticated;

CREATE POLICY "Users read own route registrations"
ON public.route_registrations FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Staff read route registrations"
ON public.route_registrations FOR SELECT TO authenticated
USING ((SELECT public.is_staff()));

CREATE OR REPLACE FUNCTION public.register_for_route(p_route_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := auth.uid();
  route_row public.routes%ROWTYPE;
  existing_status text;
  confirmed_count integer;
  assigned_status text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO route_row FROM public.routes r WHERE r.id=p_route_id FOR UPDATE;
  IF NOT FOUND OR NOT route_row.is_published THEN RAISE EXCEPTION 'Route not available'; END IF;
  IF NOT route_row.requires_registration THEN RAISE EXCEPTION 'Route does not require registration'; END IF;
  IF route_row.registration_status <> 'open' THEN RAISE EXCEPTION 'Route registration is not open'; END IF;

  SELECT rr.status INTO existing_status FROM public.route_registrations rr
  WHERE rr.user_id=uid AND rr.route_id=p_route_id;
  IF existing_status IN ('confirmed','waitlist') THEN
    RETURN jsonb_build_object('success',true,'status',existing_status,'already_registered',true);
  END IF;

  SELECT count(*) INTO confirmed_count FROM public.route_registrations rr
  WHERE rr.route_id=p_route_id AND rr.status='confirmed';
  assigned_status := CASE WHEN route_row.max_capacity IS NULL OR confirmed_count < route_row.max_capacity
    THEN 'confirmed' ELSE 'waitlist' END;

  INSERT INTO public.route_registrations(user_id,route_id,status,cancelled_at,updated_at)
  VALUES(uid,p_route_id,assigned_status,NULL,now())
  ON CONFLICT(user_id,route_id) DO UPDATE
  SET status=excluded.status,cancelled_at=NULL,updated_at=now();

  UPDATE public.routes r SET current_registrations=(
    SELECT count(*) FROM public.route_registrations rr WHERE rr.route_id=p_route_id AND rr.status='confirmed'
  ) WHERE r.id=p_route_id;

  RETURN jsonb_build_object('success',true,'status',assigned_status,'already_registered',false);
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_route_registration(p_route_id text, p_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := auth.uid();
  target_user uuid := coalesce(p_user_id,auth.uid());
  previous_status text;
  promoted_id uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF target_user IS DISTINCT FROM uid AND NOT public.is_staff() THEN RAISE EXCEPTION 'Forbidden'; END IF;

  PERFORM 1 FROM public.routes r WHERE r.id=p_route_id FOR UPDATE;
  SELECT rr.status INTO previous_status FROM public.route_registrations rr
  WHERE rr.route_id=p_route_id AND rr.user_id=target_user FOR UPDATE;
  IF previous_status IS NULL OR previous_status='cancelled' THEN RETURN false; END IF;

  UPDATE public.route_registrations SET status='cancelled',cancelled_at=now(),updated_at=now()
  WHERE route_id=p_route_id AND user_id=target_user;

  IF previous_status='confirmed' THEN
    SELECT rr.id INTO promoted_id FROM public.route_registrations rr
    WHERE rr.route_id=p_route_id AND rr.status='waitlist' ORDER BY rr.created_at FOR UPDATE SKIP LOCKED LIMIT 1;
    IF promoted_id IS NOT NULL THEN
      UPDATE public.route_registrations SET status='confirmed',updated_at=now() WHERE id=promoted_id;
    END IF;
  END IF;

  UPDATE public.routes r SET current_registrations=(
    SELECT count(*) FROM public.route_registrations rr WHERE rr.route_id=p_route_id AND rr.status='confirmed'
  ) WHERE r.id=p_route_id;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_route(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_for_route(text) TO authenticated;
REVOKE ALL ON FUNCTION public.cancel_route_registration(text,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_route_registration(text,uuid) TO authenticated;

-- Métricas confiables: se registran únicamente sesiones de usuarios autenticados.
REVOKE ALL ON public.analytics_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.user_sessions FROM PUBLIC, anon, authenticated;
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;
GRANT INSERT, SELECT, UPDATE ON public.user_sessions TO authenticated;

DROP POLICY IF EXISTS "Validated analytics event inserts" ON public.analytics_events;
CREATE POLICY "Authenticated analytics event inserts"
ON public.analytics_events FOR INSERT TO authenticated
WITH CHECK (
  user_id=(SELECT auth.uid()) AND session_id IS NOT NULL
  AND length(event_name) BETWEEN 1 AND 80 AND length(session_id) BETWEEN 16 AND 128
  AND (entity_type IS NULL OR length(entity_type)<=80)
  AND (entity_id IS NULL OR length(entity_id)<=160)
  AND (metadata IS NULL OR (jsonb_typeof(metadata)='object' AND octet_length(metadata::text)<=4096))
);

DROP POLICY IF EXISTS "Validated session inserts" ON public.user_sessions;
CREATE POLICY "Authenticated session inserts"
ON public.user_sessions FOR INSERT TO authenticated
WITH CHECK (
  user_id=(SELECT auth.uid())
  AND session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  AND (device_type IS NULL OR length(device_type)<=255)
  AND ended_at IS NULL AND duration_seconds IS NULL
);

CREATE OR REPLACE FUNCTION public.finish_user_session()
RETURNS trigger LANGUAGE plpgsql SET search_path=''
AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.duration_seconds:=greatest(0,extract(epoch FROM (NEW.ended_at-OLD.started_at))::integer);
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.finish_user_session() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS finish_user_session_trigger ON public.user_sessions;
CREATE TRIGGER finish_user_session_trigger BEFORE UPDATE ON public.user_sessions
FOR EACH ROW EXECUTE FUNCTION public.finish_user_session();
