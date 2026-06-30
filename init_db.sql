-- Database Schema Initialization for Andanzas GO V3

-- 1. Create sites table
CREATE TABLE IF NOT EXISTS public.sites (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_en TEXT,
    tipo TEXT,
    tipo_en TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    visitas INTEGER DEFAULT 0,
    logo_url TEXT,
    descripcion TEXT,
    descripcion_en TEXT,
    importancia TEXT,
    importancia_en TEXT,
    datos_historicos TEXT,
    datos_historicos_en TEXT,
    datos_curiosos TEXT[],
    datos_curiosos_en TEXT[],
    reconocimientos TEXT[],
    reconocimientos_en TEXT[],
    image_credit TEXT,
    accessibility_features TEXT[],
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    city TEXT DEFAULT 'Cali',
    language TEXT DEFAULT 'es',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    interests TEXT[] DEFAULT '{}'::text[],
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create routes table
CREATE TABLE IF NOT EXISTS public.routes (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    nombre_en TEXT,
    puntos TEXT[],
    duracion_min INTEGER,
    descripcion TEXT,
    descripcion_en TEXT,
    intro_story TEXT,
    intro_story_en TEXT,
    justificaciones TEXT[],
    justificaciones_en TEXT[],
    recomendaciones JSONB,
    gamificacion JSONB,
    is_published BOOLEAN DEFAULT false,
    reward_badge_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titulo TEXT NOT NULL,
    titulo_en TEXT,
    fecha TIMESTAMP WITH TIME ZONE,
    lugar TEXT,
    lugar_en TEXT,
    resumen TEXT,
    resumen_en TEXT,
    descripcion TEXT,
    descripcion_en TEXT,
    img TEXT,
    site_id TEXT REFERENCES public.sites(id) ON DELETE SET NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    published BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create feed_items table
CREATE TABLE IF NOT EXISTS public.feed_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type TEXT NOT NULL,
    titulo TEXT,
    titulo_en TEXT,
    contenido TEXT,
    contenido_en TEXT,
    site_id TEXT REFERENCES public.sites(id) ON DELETE SET NULL,
    icono_name TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_en TEXT,
    descripcion TEXT NOT NULL,
    descripcion_en TEXT,
    icono_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id TEXT REFERENCES public.badges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    photos TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, site_id)
);

-- 10. Create point_logs table
CREATE TABLE IF NOT EXISTS public.point_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    phone TEXT,
    ticket_type TEXT NOT NULL CHECK (ticket_type IN ('callback', 'contact')),
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --- Functions & Triggers ---

-- Secure Point Awarding Function
CREATE OR REPLACE FUNCTION public.award_points(points_to_add INTEGER, reason_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_points INTEGER;
  new_points INTEGER;
  new_level INTEGER;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Log the transaction
  INSERT INTO public.point_logs (user_id, points, reason)
  VALUES (user_id, points_to_add, reason_text);

  -- Update Profile
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = user_id
  RETURNING points INTO new_points;

  -- Calculate Level (Simple formula: 1 point = level 1, 100 points = level 2, etc.)
  new_level := floor(new_points / 100) + 1;

  UPDATE public.profiles
  SET level = new_level
  WHERE id = user_id;

  RETURN jsonb_build_object(
    'success', true,
    'new_points', new_points,
    'new_level', new_level
  );
END;
$$;

-- Trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, city, language, points, level, interests)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Explorador'),
    'Cali',
    'es',
    0,
    1,
    '{}'::text[]
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --- Row Level Security (RLS) ---

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Read Sites" ON public.sites;
DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Public Read Feed Items" ON public.feed_items;
DROP POLICY IF EXISTS "Public Read Badges" ON public.badges;
DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Read Routes" ON public.routes;
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Auth Users Insert Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Auth Users Delete Own Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Auth Users Insert Own Routes" ON public.routes;
DROP POLICY IF EXISTS "Auth Users Update Own Routes" ON public.routes;
DROP POLICY IF EXISTS "Auth Users Delete Own Routes" ON public.routes;
DROP POLICY IF EXISTS "Auth Users Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view own point logs" ON public.point_logs;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can insert own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can view own support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Anyone can insert support tickets" ON public.support_tickets;

-- Create Policies
CREATE POLICY "Public Read Sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Feed Items" ON public.feed_items FOR SELECT USING (true);
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Auth Users Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth Users Delete Own Reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Auth Users Insert Own Routes" ON public.routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth Users Update Own Routes" ON public.routes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth Users Delete Own Routes" ON public.routes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Auth Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own point logs" ON public.point_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own support tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert support tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
