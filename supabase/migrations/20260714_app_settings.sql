-- =========================================================================
-- APP SETTINGS — Feature flags / ajustes globales de la plataforma
-- Respalda el panel de administracion "Ajustes de la Aplicacion"
-- (components/panels/admin/AdminSettings.tsx) y el flag consumido por
-- RutasPanel. La tabla no existia, por lo que el panel mostraba
-- "No hay ajustes configurados". Idempotente.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Lectura publica (los flags controlan la experiencia de usuario final)
DROP POLICY IF EXISTS "app_settings_public_read" ON public.app_settings;
CREATE POLICY "app_settings_public_read" ON public.app_settings
    FOR SELECT USING (true);

-- Escritura solo staff (admin/editor)
DROP POLICY IF EXISTS "app_settings_staff_write" ON public.app_settings;
CREATE POLICY "app_settings_staff_write" ON public.app_settings
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')));

-- Seed del flag ya usado por la app (RutasPanel)
INSERT INTO public.app_settings (key, value, description)
SELECT 'enable_custom_route_requests', 'false', 'Permite a los usuarios solicitar rutas personalizadas desde el panel de Rutas.'
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings WHERE key = 'enable_custom_route_requests');
