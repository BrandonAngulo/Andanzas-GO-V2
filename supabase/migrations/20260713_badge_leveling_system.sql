-- Sistema de niveles para insignias de comportamiento genérico (favoritos, reseñas,
-- rutas creadas, rutas completadas). Las 4 insignias existentes se conservan como
-- bronce (mismo id, sin tocar user_badges ya otorgados) y se agregan 2 escalones
-- nuevos (plata/oro) por familia. Ya aplicada en el proyecto Supabase Andanzas GO V3.

ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS family_key TEXT;
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS tier INT;

CREATE TABLE IF NOT EXISTS public.user_badge_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_key TEXT NOT NULL,
    count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, family_key)
);

ALTER TABLE public.user_badge_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badge progress" ON public.user_badge_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badge progress" ON public.user_badge_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own badge progress" ON public.user_badge_progress
    FOR UPDATE USING (auth.uid() = user_id);

UPDATE public.badges SET family_key = 'fav', tier = 1 WHERE id = 'insignia-fav-1';
UPDATE public.badges SET family_key = 'review', tier = 1 WHERE id = 'insignia-review-1';
UPDATE public.badges SET family_key = 'route_create', tier = 1 WHERE id = 'insignia-route-1';
UPDATE public.badges SET family_key = 'route_complete', tier = 1 WHERE id = 'insignia-route-complete';

INSERT INTO public.badges (id, nombre, nombre_en, descripcion, descripcion_en, icono_name, family_key, tier) VALUES
('insignia-fav-2', 'Coleccionista', 'Collector', 'Guardaste 10 lugares favoritos.', 'You saved 10 favorite places.', 'Heart', 'fav', 2),
('insignia-fav-3', 'Amante de Cali', 'Cali Lover', 'Guardaste 25 lugares favoritos.', 'You saved 25 favorite places.', 'Heart', 'fav', 3),
('insignia-review-2', 'Voz de la Comunidad', 'Community Voice', 'Escribiste 5 reseñas.', 'You wrote 5 reviews.', 'PenTool', 'review', 2),
('insignia-review-3', 'Cronista Caleño', 'Cali Chronicler', 'Escribiste 15 reseñas.', 'You wrote 15 reviews.', 'PenTool', 'review', 3),
('insignia-route-2', 'Cartógrafo', 'Cartographer', 'Creaste 3 rutas personalizadas.', 'You created 3 custom routes.', 'MapIcon', 'route_create', 2),
('insignia-route-3', 'Maestro de Rutas', 'Route Master', 'Creaste 7 rutas personalizadas.', 'You created 7 custom routes.', 'MapIcon', 'route_create', 3),
('insignia-route-complete-2', 'Trotamundos', 'Globetrotter', 'Completaste 5 rutas guiadas.', 'You completed 5 guided routes.', 'Flag', 'route_complete', 2),
('insignia-route-complete-3', 'Leyenda Andariega', 'Wandering Legend', 'Completaste 10 rutas guiadas.', 'You completed 10 guided routes.', 'Flag', 'route_complete', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_badge_progress (user_id, family_key, count)
SELECT user_id, 'fav', count(*) FROM public.favorites GROUP BY user_id
ON CONFLICT (user_id, family_key) DO UPDATE SET count = EXCLUDED.count;

INSERT INTO public.user_badge_progress (user_id, family_key, count)
SELECT user_id, 'review', count(*) FROM public.reviews GROUP BY user_id
ON CONFLICT (user_id, family_key) DO UPDATE SET count = EXCLUDED.count;

INSERT INTO public.user_badge_progress (user_id, family_key, count)
SELECT user_id, 'route_create', count(*) FROM public.routes WHERE user_id IS NOT NULL GROUP BY user_id
ON CONFLICT (user_id, family_key) DO UPDATE SET count = EXCLUDED.count;
