-- Primera regla operativa administrable desde el panel.
-- Conserva el valor existente y mantiene una validación del lado del servidor.

CREATE OR REPLACE FUNCTION public.update_operational_setting(setting_key text, setting_value numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Staff access required';
  END IF;

  IF setting_key <> 'custom_route_min_notice_days' THEN
    RAISE EXCEPTION 'Setting is not administrable';
  END IF;

  IF setting_value < 1 OR setting_value > 365 OR setting_value <> trunc(setting_value) THEN
    RAISE EXCEPTION 'Value must be an integer between 1 and 365';
  END IF;

  INSERT INTO public.economy_settings(key, value, description, updated_at)
  VALUES (
    setting_key,
    to_jsonb(setting_value::integer),
    'Anticipación mínima para solicitar una ruta personalizada.',
    now()
  )
  ON CONFLICT (key) DO UPDATE
  SET value = excluded.value,
      description = excluded.description,
      updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.update_operational_setting(text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_operational_setting(text, numeric) TO authenticated;

CREATE OR REPLACE FUNCTION public.validate_custom_route_request()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  min_notice_days integer := 7;
BEGIN
  SELECT coalesce((s.value #>> '{}')::integer, 7)
  INTO min_notice_days
  FROM public.economy_settings s
  WHERE s.key = 'custom_route_min_notice_days';

  min_notice_days := coalesce(min_notice_days, 7);

  IF TG_OP = 'INSERT' THEN
    IF NEW.preferred_date IS NOT NULL AND NEW.preferred_date < current_date + min_notice_days THEN
      RAISE EXCEPTION 'CUSTOM_ROUTE_MIN_NOTICE_%_DAYS', min_notice_days;
    END IF;
    IF NEW.rules_accepted_at IS NULL THEN
      RAISE EXCEPTION 'ROUTE_RULES_MUST_BE_ACCEPTED';
    END IF;
    IF NEW.group_type IN ('Institucional', 'Colegio') AND nullif(trim(NEW.institution_name), '') IS NULL THEN
      RAISE EXCEPTION 'INSTITUTION_NAME_REQUIRED';
    END IF;
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
