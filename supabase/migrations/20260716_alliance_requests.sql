-- =========================================================================
-- ALIANZAS — Solicitudes de contacto para alianzas con Andanzas GO
-- Respalda el modal público "Alianzas" (components/panels/AlliancesModal.tsx)
-- y su gestión en el panel de administración (AdminAlianzas.tsx).
-- El formulario es un canal de contacto abierto: pueden escribir tanto
-- usuarios registrados como instituciones/personas sin cuenta.
-- Idempotente.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.alliance_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    alliance_type text NOT NULL,
    contact_name text NOT NULL,
    organization text,
    contact_email text NOT NULL,
    contact_phone text,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new',
    internal_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT alliance_type_check CHECK (alliance_type IN ('colaboracion','institucional','creacion','investigacion','otra')),
    CONSTRAINT alliance_status_check CHECK (status IN ('new','in_review','contacted','accepted','declined','archived')),
    CONSTRAINT alliance_email_check CHECK (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT alliance_phone_check CHECK (contact_phone IS NULL OR length(contact_phone) BETWEEN 7 AND 30)
);

CREATE INDEX IF NOT EXISTS alliance_requests_status_idx ON public.alliance_requests(status, created_at DESC);

-- updated_at automático
CREATE OR REPLACE FUNCTION public.touch_alliance_request()
RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS touch_alliance_request_trigger ON public.alliance_requests;
CREATE TRIGGER touch_alliance_request_trigger BEFORE UPDATE ON public.alliance_requests
FOR EACH ROW EXECUTE FUNCTION public.touch_alliance_request();

ALTER TABLE public.alliance_requests ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede enviar una solicitud de alianza (canal de contacto público).
DROP POLICY IF EXISTS "alliance_public_insert" ON public.alliance_requests;
CREATE POLICY "alliance_public_insert" ON public.alliance_requests
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Solo el staff puede leer, actualizar y eliminar las solicitudes.
DROP POLICY IF EXISTS "alliance_staff_read" ON public.alliance_requests;
CREATE POLICY "alliance_staff_read" ON public.alliance_requests
    FOR SELECT TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "alliance_staff_update" ON public.alliance_requests;
CREATE POLICY "alliance_staff_update" ON public.alliance_requests
    FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "alliance_admin_delete" ON public.alliance_requests;
CREATE POLICY "alliance_admin_delete" ON public.alliance_requests
    FOR DELETE TO authenticated USING (public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.alliance_requests TO authenticated;
GRANT INSERT ON public.alliance_requests TO anon;
