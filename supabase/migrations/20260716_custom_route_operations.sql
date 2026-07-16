-- Flujo operativo completo para solicitudes de rutas personalizadas.
ALTER TABLE public.custom_route_requests
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS institution_name text,
  ADD COLUMN IF NOT EXISTS age_range text,
  ADD COLUMN IF NOT EXISTS difficulty text,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS mobility_needs text,
  ADD COLUMN IF NOT EXISTS accessibility_needs text,
  ADD COLUMN IF NOT EXISTS preferred_date date,
  ADD COLUMN IF NOT EXISTS preferred_start_time time,
  ADD COLUMN IF NOT EXISTS date_flexibility text,
  ADD COLUMN IF NOT EXISTS meeting_area text,
  ADD COLUMN IF NOT EXISTS budget_range text,
  ADD COLUMN IF NOT EXISTS additional_notes text,
  ADD COLUMN IF NOT EXISTS rules_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS quote_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS quote_currency text DEFAULT 'COP',
  ADD COLUMN IF NOT EXISTS quote_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS design_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS client_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS canceled_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.custom_route_requests SET status=CASE status
  WHEN 'pending' THEN 'requested' WHEN 'reviewed' THEN 'under_review'
  WHEN 'contacted' THEN 'accepted' ELSE status END;
ALTER TABLE public.custom_route_requests DROP CONSTRAINT IF EXISTS custom_route_requests_status_check;
ALTER TABLE public.custom_route_requests ADD CONSTRAINT custom_route_requests_status_check CHECK(status IN
 ('requested','under_review','accepted','rejected','quote_sent','design_sent','client_approved','scheduled','completed','canceled','rescheduled'));
ALTER TABLE public.custom_route_requests ADD CONSTRAINT custom_route_contact_phone_check CHECK(contact_phone IS NULL OR length(contact_phone) BETWEEN 7 AND 30);
ALTER TABLE public.custom_route_requests ADD CONSTRAINT custom_route_duration_check CHECK(duration_minutes IS NULL OR duration_minutes BETWEEN 60 AND 720);
ALTER TABLE public.custom_route_requests ADD CONSTRAINT custom_route_quote_check CHECK(quote_amount IS NULL OR quote_amount>=0);

CREATE OR REPLACE FUNCTION public.validate_custom_route_request()
RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
  IF TG_OP='INSERT' THEN
    IF NEW.preferred_date IS NOT NULL AND NEW.preferred_date < current_date+7 THEN
      RAISE EXCEPTION 'CUSTOM_ROUTE_MIN_NOTICE_7_DAYS';
    END IF;
    IF NEW.rules_accepted_at IS NULL THEN RAISE EXCEPTION 'ROUTE_RULES_MUST_BE_ACCEPTED'; END IF;
    IF NEW.group_type IN ('Institucional','Colegio') AND nullif(trim(NEW.institution_name),'') IS NULL THEN
      RAISE EXCEPTION 'INSTITUTION_NAME_REQUIRED';
    END IF;
  END IF;
  NEW.updated_at=now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS validate_custom_route_request_trigger ON public.custom_route_requests;
CREATE TRIGGER validate_custom_route_request_trigger BEFORE INSERT OR UPDATE ON public.custom_route_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_custom_route_request();

CREATE TABLE IF NOT EXISTS public.custom_route_request_history(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), request_id uuid NOT NULL REFERENCES public.custom_route_requests(id) ON DELETE CASCADE,
  from_status text, to_status text NOT NULL, note text, changed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS custom_route_history_request_idx ON public.custom_route_request_history(request_id,created_at DESC);
ALTER TABLE public.custom_route_request_history ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.log_custom_route_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.custom_route_request_history(request_id,from_status,to_status,changed_by)
    VALUES(NEW.id,OLD.status,NEW.status,auth.uid());
    IF NEW.status='quote_sent' AND NEW.quote_sent_at IS NULL THEN NEW.quote_sent_at=now(); END IF;
    IF NEW.status='design_sent' AND NEW.design_sent_at IS NULL THEN NEW.design_sent_at=now(); END IF;
    IF NEW.status='client_approved' AND NEW.client_approved_at IS NULL THEN NEW.client_approved_at=now(); END IF;
    IF NEW.status='completed' AND NEW.completed_at IS NULL THEN NEW.completed_at=now(); END IF;
    IF NEW.status='canceled' AND NEW.canceled_at IS NULL THEN NEW.canceled_at=now(); END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS log_custom_route_status_trigger ON public.custom_route_requests;
CREATE TRIGGER log_custom_route_status_trigger BEFORE UPDATE ON public.custom_route_requests
FOR EACH ROW EXECUTE FUNCTION public.log_custom_route_status_change();

DROP POLICY IF EXISTS "Admins can update route requests" ON public.custom_route_requests;
DROP POLICY IF EXISTS "Admins can view all route requests" ON public.custom_route_requests;
DROP POLICY IF EXISTS "Admins can delete route requests" ON public.custom_route_requests;
CREATE POLICY "Staff can view route requests" ON public.custom_route_requests FOR SELECT TO authenticated USING(public.is_staff() OR user_id=(SELECT auth.uid()));
CREATE POLICY "Staff can update route requests" ON public.custom_route_requests FOR UPDATE TO authenticated
  USING(public.is_staff()) WITH CHECK(public.is_staff());
CREATE POLICY "Admins can delete route requests" ON public.custom_route_requests FOR DELETE TO authenticated USING(public.is_admin());
DROP POLICY IF EXISTS "Staff can read route history" ON public.custom_route_request_history;
CREATE POLICY "Staff can read route history" ON public.custom_route_request_history FOR SELECT TO authenticated USING(public.is_staff());
GRANT SELECT,INSERT ON public.custom_route_request_history TO authenticated;

INSERT INTO public.economy_settings(key,value,description) VALUES
 ('custom_route_min_notice_days','7','Anticipación mínima para solicitar una ruta personalizada.')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,description=excluded.description,updated_at=now();
