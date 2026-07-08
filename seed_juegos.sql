-- Seed Script for the First Trivia Game
-- Run this AFTER update_gamification_schema.sql

-- 1. Insert the "Primera Trivia" game
INSERT INTO public.games (
    title, title_en, slug, description, description_en, type, difficulty_level, status, 
    cover_title, cover_subtitle, allow_retries, show_feedback, base_points_reward, leaderboard_enabled
) VALUES (
    'Sabores y Saberes del Valle', 
    'Flavors and Knowledge of the Valley', 
    'sabores-saberes-valle',
    'Descubre los secretos detrás de los platos y bebidas más icónicos del Valle del Cauca.', 
    'Discover the secrets behind the most iconic dishes and drinks of Valle del Cauca.',
    'trivia', 'easy', 'published', 
    'El Sabor que nos Une', 'Juego de Gastronomía Local', 
    true, true, 100, false
) RETURNING id;

-- Wait, to make it easier for copy-pasting into Supabase SQL editor without dealing with returning IDs, 
-- we will use a DO block or CTE.

DO $$
DECLARE
    new_game_id UUID;
BEGIN
    INSERT INTO public.games (
        title, title_en, slug, description, description_en, type, difficulty_level, status, 
        cover_title, cover_subtitle, allow_retries, show_feedback, base_points_reward, leaderboard_enabled
    ) VALUES (
        'Sabores y Saberes del Valle', 
        'Flavors and Knowledge of the Valley', 
        'sabores-saberes-valle',
        'Descubre los secretos detrás de los platos y bebidas más icónicos del Valle del Cauca.', 
        'Discover the secrets behind the most iconic dishes and drinks of Valle del Cauca.',
        'trivia', 'easy', 'published', 
        'El Sabor que nos Une', 'Juego de Gastronomía Local', 
        true, true, 100, false
    ) RETURNING id INTO new_game_id;

    -- Insert Question 1 (Borojo / Chontaduro)
    INSERT INTO public.game_questions (
        game_id, question_text, question_text_en, question_type, category, level,
        options, correct_answer, explanation, points_reward, time_limit_sec, status
    ) VALUES (
        new_game_id, 
        '¿En qué año fue construida la Galería Alameda, el mercado de alimentos más antiguo de Cali?',
        'In what year was Galería Alameda built, Cali''s oldest food market?',
        'multiple_choice', 'Gastronomía', 1,
        '["1910", "1926", "1945", "1960"]'::jsonb,
        '"1926"'::jsonb,
        'Algunos puestos de frutas de la Galería llevan más de 60 años atendidos por la misma familia. La memoria comercial del mercado es, en sí misma, patrimonio cultural de Cali.',
        150, 30, 'published'
    );

    -- Insert Question 2 (Champús)
    INSERT INTO public.game_questions (
        game_id, question_text, question_text_en, question_type, category, level,
        options, correct_answer, explanation, points_reward, time_limit_sec, status
    ) VALUES (
        new_game_id, 
        '¿Qué grano es la base del champús, la bebida tradicional del Valle del Cauca con raíces prehispánicas?',
        'What grain is the base of champús, the traditional Valle del Cauca drink with pre-Hispanic roots?',
        'multiple_choice', 'Gastronomía', 1,
        '["Arroz", "Maíz Quebrado", "Cebada", "Trigo"]'::jsonb,
        '"Maíz Quebrado"'::jsonb,
        'El champús se ha preparado en el Valle del Cauca desde antes de la llegada de los españoles. La receta original indígena fue adaptada con canela, panela y lulo — ingredientes coloniales — dando lugar a la versión que se toma hoy.',
        150, 30, 'published'
    );

    -- Insert Question 3 (Pandebono)
    INSERT INTO public.game_questions (
        game_id, question_text, question_text_en, question_type, category, level,
        options, correct_answer, explanation, points_reward, time_limit_sec, status
    ) VALUES (
        new_game_id, 
        '¿Cuántos días de fermentación necesita el almidón de yuca agria para poder usarse en la elaboración de un pandebono auténtico?',
        'How many days of fermentation does sour cassava starch need to be used in making an authentic pandebono?',
        'multiple_choice', 'Gastronomía', 1,
        '["2 días", "5 días", "Hasta 15 días", "30 días"]'::jsonb,
        '"Hasta 15 días"'::jsonb,
        'Existen más de 30 variedades de pandebono en el Valle del Cauca. Cada subregión — Palmira, Tuluá, Buga, Cartago — tiene su propia receta familiar con proporciones ligeramente distintas.',
        150, 30, 'published'
    );
END $$;
