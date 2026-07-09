-- =========================================================================
-- FASE 15: AVATARES, GAMIFICACIÓN Y PANEL INSTITUCIONAL
-- =========================================================================

-- 1. Avatares
CREATE TABLE IF NOT EXISTS public.avatar_presets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'hybrid',
    image_url TEXT NOT NULL,
    personality_title TEXT,
    personality_description TEXT,
    phrase TEXT,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_avatar_id TEXT REFERENCES public.avatar_presets(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS leaderboard_opt_in BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_display_name TEXT;

ALTER TABLE public.avatar_presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Avatars" ON public.avatar_presets FOR SELECT USING (active = true);


-- Insert initial avatars
INSERT INTO public.avatar_presets (id, name, image_url, personality_title, personality_description, phrase, order_index) VALUES
('ave', 'El Ave Curiosa', '/avatars/bichofue.jpg', 'Observadora y ligera', 'Atenta a los detalles más escondidos de la ciudad.', '“Mirá dos veces: la ciudad siempre deja pistas.”', 1),
('gata', 'La Gata Callejera', '/avatars/gato.jpg', 'Independiente e intuitiva', 'Amante de los rincones, tejados y atajos secretos.', '“Por aquí hay algo que no sale en los mapas.”', 2),
('salsera', 'El Caleño Salsero', '/avatars/salsero.jpg', 'Festivo y rítmico', 'Conoce la ciudad por sus sonidos y su cadencia al caminar.', '“Si escuchás bien, Cali también camina en clave.”', 3)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;


-- 2. Contenido Institucional
CREATE TABLE IF NOT EXISTS public.institutional_content (
    id TEXT PRIMARY KEY, -- 'mission', 'what_is', 'who_is', 'website', 'instagram', 'facebook'
    title TEXT,
    content_text TEXT NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.institutional_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Institutional" ON public.institutional_content FOR SELECT USING (true);
CREATE POLICY "Admin All Access Institutional" ON public.institutional_content FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

INSERT INTO public.institutional_content (id, title, content_text) VALUES
('mission', 'Nuestra Misión', 'Democratizar el acceso al patrimonio y la cultura en Cali.'),
('what_is', '¿Qué es Andanzas GO?', 'Una herramienta lúdica y educativa para redescubrir la ciudad.'),
('who_is', '¿Quiénes somos?', 'Andanzas Centro Cultural es una organización dedicada al arte.'),
('website', 'Sitio Web', 'http://www.andanzascentrocultural.com'),
('instagram', 'Instagram', 'https://www.instagram.com/andanzas_centrocultural/'),
('facebook', 'Facebook', 'https://www.facebook.com/andanzascentrocultural')
ON CONFLICT DO NOTHING;


-- 3. Gamificación de Rutas
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS gamification_level TEXT DEFAULT 'none' CHECK (gamification_level IN ('none', 'light', 'medium', 'full'));
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS completion_status TEXT DEFAULT 'content_only' CHECK (completion_status IN ('content_only', 'map_ready', 'mission_ready', 'fully_playable'));
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS points_reward INTEGER DEFAULT 0;
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS badge_id UUID;
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS narrative_question TEXT;
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS intro_text TEXT;
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS closing_text TEXT;

CREATE TABLE IF NOT EXISTS public.route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id TEXT REFERENCES public.routes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    instruction_text TEXT,
    story_text TEXT,
    required_for_completion BOOLEAN DEFAULT true,
    estimated_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.route_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id TEXT REFERENCES public.routes(id) ON DELETE CASCADE,
    stop_id UUID REFERENCES public.route_stops(id) ON DELETE CASCADE,
    challenge_type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    points_reward INTEGER DEFAULT 10,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_route_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    route_id TEXT REFERENCES public.routes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('saved', 'in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_stop_id UUID REFERENCES public.route_stops(id),
    visited_stop_ids UUID[] DEFAULT '{}',
    completed_challenge_ids UUID[] DEFAULT '{}',
    progress_percent INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    UNIQUE(user_id, route_id)
);


-- 4. Motor de Juegos y Trivias
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    type TEXT DEFAULT 'trivia',
    status TEXT DEFAULT 'draft',
    cover_title TEXT,
    time_limit_seconds INTEGER,
    points_per_correct_answer INTEGER DEFAULT 10,
    leaderboard_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.game_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    difficulty TEXT DEFAULT 'medium',
    options JSONB,
    correct_answer JSONB,
    explanation TEXT,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'started',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0
);
