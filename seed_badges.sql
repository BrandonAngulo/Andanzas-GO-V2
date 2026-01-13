INSERT INTO public.badges (
        id, nombre, nombre_en, descripcion, descripcion_en, icono_name
    ) VALUES (
        'insignia-fav-1',
        'Primer Favorito',
        'First Favorite',
        'Guardaste tu primer lugar favorito.',
        'You saved your first favorite place.',
        'Heart'
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        nombre_en = EXCLUDED.nombre_en,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en,
        icono_name = EXCLUDED.icono_name;

INSERT INTO public.badges (
        id, nombre, nombre_en, descripcion, descripcion_en, icono_name
    ) VALUES (
        'insignia-review-1',
        'Crítico Local',
        'Local Critic',
        'Escribiste tu primera reseña.',
        'You wrote your first review.',
        'PenTool'
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        nombre_en = EXCLUDED.nombre_en,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en,
        icono_name = EXCLUDED.icono_name;

INSERT INTO public.badges (
        id, nombre, nombre_en, descripcion, descripcion_en, icono_name
    ) VALUES (
        'insignia-route-1',
        'Creador de Rutas',
        'Route Creator',
        'Creaste tu primera ruta personalizada.',
        'You created your first custom route.',
        'MapIcon'
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        nombre_en = EXCLUDED.nombre_en,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en,
        icono_name = EXCLUDED.icono_name;

INSERT INTO public.badges (
        id, nombre, nombre_en, descripcion, descripcion_en, icono_name
    ) VALUES (
        'insignia-route-complete',
        'Andariego',
        'Wanderer',
        'Completaste una ruta guiada.',
        'You completed a guided route.',
        'Flag'
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        nombre_en = EXCLUDED.nombre_en,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en,
        icono_name = EXCLUDED.icono_name;

