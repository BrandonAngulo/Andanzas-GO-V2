-- =========================================================================
-- LEGAL DOCUMENTS, COMMUNITY & MODERATION
-- =========================================================================

-- 1. Legal Documents Table
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT NOT NULL CHECK (document_type IN ('privacy_policy', 'terms_of_service', 'community_guidelines', 'accessibility_statement', 'consent_text', 'other')),
    title TEXT NOT NULL,
    version TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    content_html TEXT,
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'scheduled', 'archived')),
    effective_date TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    requires_acceptance BOOLEAN DEFAULT false,
    requires_reacceptance BOOLEAN DEFAULT false,
    change_summary TEXT,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    published_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Policy to allow anyone to read published legal documents
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Published Legal Docs" ON public.legal_documents 
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admin All Access Legal Docs" ON public.legal_documents 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));


-- 2. User Legal Acceptances Table
CREATE TABLE IF NOT EXISTS public.user_legal_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_version TEXT NOT NULL,
    document_id UUID REFERENCES public.legal_documents(id),
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ip_address TEXT,
    user_agent TEXT
);

ALTER TABLE public.user_legal_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own acceptances" ON public.user_legal_acceptances 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own acceptances" ON public.user_legal_acceptances 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin read all acceptances" ON public.user_legal_acceptances 
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 3. Moderation Appeals Table
CREATE TABLE IF NOT EXISTS public.moderation_appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    moderation_case_id UUID, -- References a hypothetical moderation case
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'accepted', 'rejected', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.moderation_appeals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own appeals" ON public.moderation_appeals 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create appeals" ON public.moderation_appeals 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage appeals" ON public.moderation_appeals 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 4. Modifying Profiles (Accessibility Preferences)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accessibility_preferences JSONB DEFAULT '{}'::jsonb;

-- 5. Seed Initial Legal Documents
-- El contenido definitivo se carga en la migracion 20260714_seed_legal_documents.sql
-- (idempotente, verificado por md5).
