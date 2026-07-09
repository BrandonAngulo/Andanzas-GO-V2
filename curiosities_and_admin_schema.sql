-- 1. Actualización de perfiles para soportar el baneo
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Validar que el status solo sea 'active' o 'banned'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_status_check') THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'banned'));
    END IF;
END $$;


-- 2. Creación de la tabla curious_facts
CREATE TABLE IF NOT EXISTS public.curious_facts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    text TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Cali',
    category TEXT NOT NULL DEFAULT 'Historia',
    tags TEXT[] DEFAULT '{}'::text[],

    related_entry_id UUID, -- Relacionado a Pa' que sepás (learn_entries)
    related_route_id TEXT, -- Relacionado a Rutas
    related_game_id UUID,  -- Relacionado a Juegos

    status TEXT NOT NULL DEFAULT 'draft',
    CONSTRAINT curious_facts_status_check CHECK (status IN ('draft', 'review', 'ready', 'scheduled', 'published', 'archived')),

    publish_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,

    show_in_home BOOLEAN DEFAULT false,
    show_in_pa_que_sepas BOOLEAN DEFAULT false,
    show_as_notification BOOLEAN DEFAULT false,
    show_as_news BOOLEAN DEFAULT false,

    notification_title TEXT,
    notification_body TEXT,

    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS en curious_facts
ALTER TABLE public.curious_facts ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Todo el mundo puede ver las publicadas
CREATE POLICY "Public Read Published Curiosities" ON public.curious_facts FOR SELECT USING (status = 'published');

-- Solo admin y editors pueden ver todas y modificarlas
-- (Se usará service_role u omitir la validación profunda en la política por practicidad si se confía en el backend, 
-- pero añadimos políticas seguras)
CREATE POLICY "Admin All Access Curiosities" ON public.curious_facts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);


-- 4. Migración de datos quemados (Las 6 publicadas iniciales + algunas en ready)
INSERT INTO public.curious_facts (title, text, category, status, show_in_home, show_in_pa_que_sepas) VALUES
('Las Tres Cruces', 'Según la leyenda caleña, las Tres Cruces se levantaron para encerrar al demonio Buziraco, que traía pestes a la ciudad.', 'Mitos y Leyendas', 'published', true, true),
('La Ermita', 'La Ermita no siempre fue de estilo gótico. La original fue destruida por un terremoto en 1925 y reconstruida años después.', 'Arquitectura', 'published', true, true),
('El Gato del Río', 'La escultura del Gato del Río, obra de Hernando Tejada, fue donada a la ciudad y hoy tiene varias "novias" felinas adornando la ribera.', 'Arte Urbano', 'published', true, false),
('Cristo Rey', 'El monumento a Cristo Rey mide 26 metros y conmemora los 50 años del final de la Guerra de los Mil Días.', 'Historia', 'published', true, false),
('Caliwood', 'A Cali se le conoció como "Caliwood" en los años 70 por ser el epicentro de un gran boom de producción cinematográfica en Colombia.', 'Cine', 'ready', false, false),
('Maceta de Alfeñique', 'La maceta de dulce de alfeñique es una tradición única de Cali que los padrinos regalan a sus ahijados cada 29 de junio.', 'Tradiciones', 'ready', false, false),
('Chontaduro', 'El chontaduro, a menudo acompañado con sal y miel, es uno de los frutos más emblemáticos y consumidos en las calles de Cali.', 'Gastronomía', 'ready', false, false),
('El Mulato Cabaret', 'El Mulato Cabaret es uno de los lugares más icónicos para presenciar el verdadero estilo de baile caleño, rápido y acrobático.', 'Cultura', 'scheduled', false, false),
('San Antonio', 'El barrio San Antonio es famoso por sus casas coloniales y por ser el corazón bohemio y cultural de la ciudad.', 'Arquitectura', 'scheduled', false, false)
ON CONFLICT DO NOTHING;
