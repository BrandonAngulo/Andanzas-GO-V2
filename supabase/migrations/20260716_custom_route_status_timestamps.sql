ALTER TABLE public.custom_route_requests
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS previous_scheduled_at timestamptz;

CREATE OR REPLACE FUNCTION public.log_custom_route_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF OLD.scheduled_at IS DISTINCT FROM NEW.scheduled_at AND OLD.scheduled_at IS NOT NULL THEN
    NEW.previous_scheduled_at=OLD.scheduled_at;
  END IF;
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.custom_route_request_history(request_id,from_status,to_status,changed_by)
    VALUES(NEW.id,OLD.status,NEW.status,auth.uid());
    IF NEW.status='accepted' AND NEW.accepted_at IS NULL THEN NEW.accepted_at=now(); END IF;
    IF NEW.status='rejected' AND NEW.rejected_at IS NULL THEN NEW.rejected_at=now(); END IF;
    IF NEW.status='quote_sent' AND NEW.quote_sent_at IS NULL THEN NEW.quote_sent_at=now(); END IF;
    IF NEW.status='design_sent' AND NEW.design_sent_at IS NULL THEN NEW.design_sent_at=now(); END IF;
    IF NEW.status='client_approved' AND NEW.client_approved_at IS NULL THEN NEW.client_approved_at=now(); END IF;
    IF NEW.status='completed' AND NEW.completed_at IS NULL THEN NEW.completed_at=now(); END IF;
    IF NEW.status='canceled' AND NEW.canceled_at IS NULL THEN NEW.canceled_at=now(); END IF;
  END IF;
  RETURN NEW;
END;
$$;
