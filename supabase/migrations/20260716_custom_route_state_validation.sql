CREATE OR REPLACE FUNCTION public.validate_custom_route_request()
RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
  IF TG_OP='INSERT' THEN
    IF NEW.preferred_date IS NULL OR NEW.preferred_date<current_date+7 THEN RAISE EXCEPTION 'CUSTOM_ROUTE_MIN_NOTICE_7_DAYS'; END IF;
    IF NEW.rules_accepted_at IS NULL THEN RAISE EXCEPTION 'ROUTE_RULES_MUST_BE_ACCEPTED'; END IF;
    IF NEW.group_type IN ('Institucional','Colegio') AND nullif(trim(NEW.institution_name),'') IS NULL THEN RAISE EXCEPTION 'INSTITUTION_NAME_REQUIRED'; END IF;
  END IF;
  IF NEW.status='quote_sent' AND NEW.quote_amount IS NULL THEN RAISE EXCEPTION 'QUOTE_AMOUNT_REQUIRED'; END IF;
  IF NEW.status IN ('scheduled','rescheduled') AND NEW.scheduled_at IS NULL THEN RAISE EXCEPTION 'SCHEDULED_DATE_REQUIRED'; END IF;
  IF NEW.status='rejected' AND nullif(trim(NEW.rejection_reason),'') IS NULL THEN RAISE EXCEPTION 'REJECTION_REASON_REQUIRED'; END IF;
  NEW.updated_at=now(); RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_custom_route_request(),public.log_custom_route_status_change() FROM PUBLIC,anon,authenticated;
