-- Phase 16: Passport Stamps, Games Update, and Analytics

-- 1. Passport Stamps
CREATE TABLE IF NOT EXISTS public.passport_stamps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stamp_type TEXT NOT NULL CHECK (stamp_type IN ('city', 'route', 'game', 'campaign', 'event', 'special')),
    entity_id UUID,
    title TEXT NOT NULL,
    subtitle TEXT,
    city TEXT,
    icon TEXT,
    image_url TEXT,
    color_theme TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_passport_stamps_user_id ON public.passport_stamps(user_id);

-- Enable RLS
ALTER TABLE public.passport_stamps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stamps" ON public.passport_stamps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stamps" ON public.passport_stamps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR email = 'gruesobrandon@gmail.com')
        )
    );

CREATE POLICY "System can insert stamps" ON public.passport_stamps
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 2. Learn Entries (Pa' que sepás) Updates
ALTER TABLE public.learn_entries
ADD COLUMN IF NOT EXISTS illustration_url TEXT,
ADD COLUMN IF NOT EXISTS illustration_alt TEXT,
ADD COLUMN IF NOT EXISTS illustration_style TEXT,
ADD COLUMN IF NOT EXISTS color_theme TEXT;


-- 3. Games Updates
-- Update constraint for games status if it exists, otherwise just add columns
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_status_check;
ALTER TABLE public.games ADD CONSTRAINT games_status_check CHECK (status IN ('draft', 'ready', 'coming_soon', 'scheduled', 'published', 'paused', 'archived')), 
ADD COLUMN IF NOT EXISTS release_at TIMESTAMP WITH TIME ZONE, 
ADD COLUMN IF NOT EXISTS show_countdown BOOLEAN DEFAULT false, 
ADD COLUMN IF NOT EXISTS cover_subtitle TEXT, 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT, 
ADD COLUMN IF NOT EXISTS cover_theme TEXT, 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS points_per_correct_answer INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS time_limit_seconds INTEGER;

-- Add 'category' column to game_questions for the Valle trivia
ALTER TABLE public.game_questions
ADD COLUMN IF NOT EXISTS category TEXT;

-- 4. Analytics Events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  entity_type TEXT NULL,
  entity_id TEXT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);

-- Analytics RLS (Users can insert their own events, admins can view all)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events (anonymous allowed)" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR email = 'gruesobrandon@gmail.com')
        )
    );


-- 5. User Sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMP WITH TIME ZONE NULL,
  duration_seconds INT NULL,
  device_type TEXT NULL,
  city_context TEXT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON public.user_sessions(started_at);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view sessions" ON public.user_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR email = 'gruesobrandon@gmail.com')
        )
    );
CREATE POLICY "Users can update their sessions" ON public.user_sessions
    FOR UPDATE USING (
        user_id = auth.uid() OR user_id IS NULL
    );


-- 6. Insert new Avatars
INSERT INTO public.avatar_presets (id, name, image_url, personality_description, personality_title, phrase, type, active, order_index)
VALUES 
  ('female_explorer', 'Exploradora Urbana', '/avatars/female_explorer.png', 'Siempre lista para caminar y descubrir rincones ocultos.', 'La Caminante Curiosa', '¡Vení, que por aquí hay una historia escondida!', 'human', true, 10),
  ('female_reader', 'Lectora de Memoria', '/avatars/female_reader.png', 'Busca las letras, las leyendas y los cuentos de cada calle.', 'La Guardiana de Historias', 'Cada fachada tiene algo que contarnos.', 'human', true, 11),
  ('neutral_salsa', 'Salserx Caleñx', '/avatars/neutral_salsa.png', 'Lleva el ritmo de la ciudad en los pies.', 'El Alma de la Fiesta', '¡Esa campana llama, vámonos!', 'human', true, 12),
  ('neutral_food', 'Catadorx de Sabores', '/avatars/neutral_food.png', 'Conoce las mejores empanadas, luladas y pandebonos.', 'El Paladar Caleño', 'Después de caminar, el cuerpo pide pandebono.', 'human', true, 13)
ON CONFLICT (id) DO NOTHING;

-- 7. Update Trivia Cali 
UPDATE public.games SET cover_title = '¿Qué tanto sabés de la ciudad que estás andando?', cover_subtitle = 'Ponete a prueba con Trivia Cali' WHERE id = '81111111-1111-1111-1111-111111111111';

INSERT INTO public.games (id, title, slug, description, type, status, cover_title, cover_subtitle, show_countdown, points_per_correct_answer, time_limit_seconds) VALUES 
('83333333-3333-3333-3333-333333333333', '¿Qué tanto sabés del Valle del Cauca?', 'trivia-valle-cauca', 'Recorre los 42 municipios, sus sabores, su biodiversidad y su historia en este gran desafío regional.', 'trivia', 'coming_soon', '¿Qué tanto sabés del Valle del Cauca?', 'Muy pronto vas a poder descubrir sus municipios, sabores, memorias, paisajes y saberes.', false, 10, 15)
ON CONFLICT (id) DO UPDATE SET cover_title = EXCLUDED.cover_title, cover_subtitle = EXCLUDED.cover_subtitle, status = 'coming_soon';

INSERT INTO public.game_questions (id, game_id, question_text, question_type, level, options, correct_answer, category) VALUES 
('93333333-3333-3333-3333-333333333331', '83333333-3333-3333-3333-333333333333', '¿Cuál es el municipio conocido como la "Capital Señora" de Colombia?', 'multiple_choice', 1, '["Buga", "Cartago", "Palmira", "Tuluá"]', '0', 'Municipios y territorio'),
('93333333-3333-3333-3333-333333333332', '83333333-3333-3333-3333-333333333333', '¿Qué bebida tradicional del Pacífico colombiano se elabora a base de caña de azúcar?', 'multiple_choice', 2, '["Lulada", "Champús", "Viche", "Masato"]', '2', 'Valle Pacífico'),
('93333333-3333-3333-3333-333333333333', '83333333-3333-3333-3333-333333333333', '¿En qué municipio del Valle se encuentra el famoso muelle turístico hacia el océano Pacífico?', 'multiple_choice', 1, '["Buenaventura", "Dagua", "Cali", "Jamundí"]', '0', 'Municipios y territorio'),
('93333333-3333-3333-3333-333333333334', '83333333-3333-3333-3333-333333333333', '¿Cuál de estos platos NO es tradicional del Valle del Cauca?', 'multiple_choice', 2, '["Aborrajado", "Marranita", "Bandeja Paisa", "Sancocho de Gallina"]', '2', 'Valle comestible'),
('93333333-3333-3333-3333-333333333335', '83333333-3333-3333-3333-333333333333', '¿Qué importante ecosistema natural y parque nacional se comparte con otros departamentos, pero tiene gran parte en el Valle?', 'multiple_choice', 3, '["Parque Nacional Natural Los Farallones", "Parque Nacional Natural Puracé", "Parque Nacional Natural Las Hermosas", "Santuario de Flora y Fauna Malpelo"]', '0', 'Valle natural')
ON CONFLICT (id) DO NOTHING;
