-- 1. Añadir columnas de relación transversal a los juegos y preguntas
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS related_learn_ids UUID[] DEFAULT ARRAY[]::UUID[];
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS related_route_ids TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS related_learn_id UUID;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS related_news_id UUID;

-- 2. Eliminar juegos base (si existieran versiones previas de prueba)
DELETE FROM public.games WHERE slug IN ('trivia-cali', 'valle-vivo');

-- 3. Insertar Semilla: Trivia Cali (Activa)
INSERT INTO public.games (
    id, title, description, slug, type, difficulty_level, 
    status, allow_retries, show_feedback, leaderboard_enabled, public_ranking_enabled, bonus_time_enabled,
    cover_title, cover_subtitle
) VALUES (
    '81111111-1111-1111-1111-111111111111',
    'Trivia Cali',
    'Ponete a prueba sobre leyendas, comida y cultura de la Sucursal del Cielo.',
    'trivia-cali',
    'trivia',
    'easy',
    'published',
    true,
    true,
    false,
    false,
    true,
    'Ponete a prueba: Cali',
    'Demuestra cuánto sabés de tu ciudad'
);

-- Buscar ID de un Pa' que sepás relacionado con Buziraco (si existe)
DO $$
DECLARE
    buziraco_id UUID;
    maceta_id UUID;
BEGIN
    SELECT id INTO buziraco_id FROM public.learn_entries WHERE title ILIKE '%buziraco%' LIMIT 1;
    SELECT id INTO maceta_id FROM public.learn_entries WHERE title ILIKE '%maceta%' LIMIT 1;

    -- Update game to relate to buziraco if found
    IF buziraco_id IS NOT NULL THEN
        UPDATE public.games SET related_learn_ids = array_append(related_learn_ids, buziraco_id) WHERE slug = 'trivia-cali';
    END IF;

    -- Insert Questions for Trivia Cali
    INSERT INTO public.game_questions (
        game_id, question_text, options, correct_answer, points_reward, time_limit_sec, 
        explanation, related_learn_id, status
    ) VALUES (
        '81111111-1111-1111-1111-111111111111',
        'Según la leyenda caleña, ¿qué buscaban encerrar las Tres Cruces?',
        '["El Buziraco", "El Duende", "La Llorona", "El Silbón"]'::jsonb,
        '"El Buziraco"',
        20,
        30,
        'Esta historia hace parte de las leyendas urbanas de Cali, donde se cuenta que las cruces fueron puestas para sellar al demonio Buziraco.',
        buziraco_id,
        'published'
    ),
    (
        '81111111-1111-1111-1111-111111111111',
        '¿Cuál de los siguientes NO es un monumento emblemático de Cali?',
        '["Cristo Rey", "Monumento a la Solidaridad", "El Gato de Tejada", "El Castillo de San Felipe"]'::jsonb,
        '"El Castillo de San Felipe"',
        10,
        20,
        'El Castillo de San Felipe se encuentra en Cartagena, no en Cali.',
        NULL,
        'published'
    ),
    (
        '81111111-1111-1111-1111-111111111111',
        '¿A quién se le regalan las macetas de alfeñique en junio?',
        '["A los abuelos", "A los ahijados", "A los profesores", "A los padres"]'::jsonb,
        '"A los ahijados"',
        15,
        25,
        'Es una tradición caleña que los padrinos le regalen macetas de alfeñique a sus ahijados.',
        maceta_id,
        'published'
    );
END $$;


-- 4. Insertar Semilla: Valle Vivo (Inactiva / Próximamente)
INSERT INTO public.games (
    id, title, description, slug, type, difficulty_level, 
    status, allow_retries, show_feedback, leaderboard_enabled, public_ranking_enabled, bonus_time_enabled,
    cover_title, cover_subtitle
) VALUES (
    '82222222-2222-2222-2222-222222222222',
    'Andanza por el Valle (Valle Vivo)',
    'Explora los municipios, la gastronomía y la cultura del Valle del Cauca.',
    'valle-vivo',
    'trivia',
    'medium',
    'coming_soon',
    true,
    true,
    false,
    false,
    true,
    '¿Qué tanto sabés del Valle?',
    'Próximamente'
);

-- Insert Questions for Valle Vivo (Drafts)
INSERT INTO public.game_questions (
    game_id, question_text, options, correct_answer, points_reward, time_limit_sec, 
    explanation, status
) VALUES (
    '82222222-2222-2222-2222-222222222222',
    '¿Cuál es la fruta emblemática que se cultiva principalmente en el norte del Valle y se usa para el lulada?',
    '["Chontaduro", "Badea", "Lulo", "Guanábana"]'::jsonb,
    '"Lulo"',
    10,
    30,
    'El lulo es esencial para hacer la refrescante lulada.',
    'draft'
);
