-- 1. Create the learn_entries table
CREATE TABLE IF NOT EXISTS public.learn_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    content_simple TEXT NOT NULL,           -- Capa superficial (contexto bǭsico)
    content_simple_en TEXT,
    content_deep TEXT,                      -- Capa profunda (vueltas inesperadas, rigor)
    content_deep_en TEXT,
    curiosity TEXT NOT NULL,                -- El dato para el "Sabas que..."
    curiosity_en TEXT,
    city TEXT DEFAULT 'Cali',               -- Etiqueta de ciudad (Cali por defecto)
    tags TEXT[] DEFAULT '{}',
    site_id TEXT,                           -- Ancla opcional a un sitio
    route_id TEXT,                          -- Ancla opcional a una ruta
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.learn_entries ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public access (read-only)
CREATE POLICY "Learn entries are viewable by everyone" ON public.learn_entries
    FOR SELECT USING (true);

-- 4. Insert dummy entry (will be replaced by Brandon)
INSERT INTO public.learn_entries (
    title, 
    content_simple, 
    content_deep, 
    curiosity, 
    tags
) VALUES (
    'La Sucursal del Cielo', 
    'Cali es conocida como la Sucursal del Cielo por su clima cǭlido y la amabilidad de su gente.', 
    'El tǸrmino se populariz a mediados del siglo XX en el marco de la Feria de Cali, impulsado por el civismo que caracteriz a la ciudad tras los Juegos Panamericanos de 1971.', 
    'Sabas que a Cali le dicen la Sucursal del Cielo desde hace mǭs de 50 aos?', 
    ARRAY['historia', 'cultura']
);
