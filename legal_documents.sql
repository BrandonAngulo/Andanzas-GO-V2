-- SQL Script para crear las tablas de documentos legales y aceptar términos
-- Cópialo y pégalo en el editor SQL de Supabase y ejecútalo.

-- Crear tabla legal_documents
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT NOT NULL CHECK (document_type IN ('privacy_policy', 'terms_of_service', 'community_guidelines', 'accessibility_statement', 'consent_text', 'other')),
    title TEXT NOT NULL,
    version TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    content_html TEXT,
    language TEXT NOT NULL DEFAULT 'es',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'scheduled', 'archived')),
    effective_date TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    requires_acceptance BOOLEAN NOT NULL DEFAULT false,
    requires_reacceptance BOOLEAN NOT NULL DEFAULT false,
    change_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Habilitar RLS en legal_documents
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para legal_documents
CREATE POLICY "Documentos publicados son visibles para todos" 
    ON public.legal_documents FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Admins pueden ver todos los documentos legales" 
    ON public.legal_documents FOR SELECT 
    USING (
        auth.uid() IN (SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor'))
        OR auth.email() = 'gruesobrandon@gmail.com'
    );

CREATE POLICY "Admins pueden insertar documentos legales" 
    ON public.legal_documents FOR INSERT 
    WITH CHECK (
        auth.uid() IN (SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor'))
        OR auth.email() = 'gruesobrandon@gmail.com'
    );

CREATE POLICY "Admins pueden actualizar documentos legales" 
    ON public.legal_documents FOR UPDATE 
    USING (
        auth.uid() IN (SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor'))
        OR auth.email() = 'gruesobrandon@gmail.com'
    );

CREATE POLICY "Admins pueden eliminar documentos legales" 
    ON public.legal_documents FOR DELETE 
    USING (
        auth.uid() IN (SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor'))
        OR auth.email() = 'gruesobrandon@gmail.com'
    );

-- Crear tabla user_legal_acceptances
CREATE TABLE IF NOT EXISTS public.user_legal_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.legal_documents(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_version TEXT NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_user_legal_acceptances_user_id ON public.user_legal_acceptances(user_id);
CREATE UNIQUE INDEX idx_user_legal_acceptances_user_doc_version ON public.user_legal_acceptances(user_id, document_type, document_version);

-- Habilitar RLS en user_legal_acceptances
ALTER TABLE public.user_legal_acceptances ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para user_legal_acceptances
CREATE POLICY "Usuarios pueden ver sus propias aceptaciones" 
    ON public.user_legal_acceptances FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias aceptaciones" 
    ON public.user_legal_acceptances FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins pueden ver todas las aceptaciones" 
    ON public.user_legal_acceptances FOR SELECT 
    USING (
        auth.uid() IN (SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor'))
        OR auth.email() = 'gruesobrandon@gmail.com'
    );

-- Insertar documentos legales base
INSERT INTO public.legal_documents (document_type, title, version, content_markdown, status, language, requires_acceptance, requires_reacceptance)
VALUES 
('terms_of_service', 'Términos de Servicio de Andanzas GO', '1.0.0', '# Términos de Servicio\n\nBienvenido a Andanzas GO. Al utilizar nuestra aplicación, aceptas estos términos...\n\n**1. Uso de la Aplicación**\n...', 'published', 'es', true, false),
('privacy_policy', 'Política de Privacidad', '1.0.0', '# Política de Privacidad\n\nTu privacidad es importante para nosotros...\n\n**1. Datos que recopilamos**\n...', 'published', 'es', true, false),
('community_guidelines', 'Normas de la Comunidad', '1.0.0', '# Normas de la Comunidad\n\nPara mantener un ambiente seguro y respetuoso...\n\n**1. Respeto mutuo**\n...', 'published', 'es', false, false)
ON CONFLICT DO NOTHING;
