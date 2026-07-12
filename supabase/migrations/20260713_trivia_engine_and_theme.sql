-- ============================================================================
-- Migración: motor de trivia con variedad de tipos + identidad visual por juego
-- Fecha: 2026-07-13
-- ============================================================================

-- 1. Expandir el tipo de pregunta soportado.
--    Antes: multiple_choice | true_false | guess_by_clue | matching | ordering
--      (true_false y guess_by_clue nunca tuvieron interacción propia en el motor;
--       se reemplazan por 'question_format', una variante de copy sobre multiple_choice)
--    Ahora: multiple_choice | multi_select | ordering | matching | image_choice
ALTER TABLE public.game_questions DROP CONSTRAINT IF EXISTS game_questions_question_type_check;
ALTER TABLE public.game_questions
    ADD CONSTRAINT game_questions_question_type_check
    CHECK (question_type IN ('multiple_choice', 'multi_select', 'ordering', 'matching', 'image_choice'));

-- 2. Variante cosmética para preguntas de opción múltiple (no cambia la lógica de verificación,
--    solo el encabezado que ve el jugador).
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS question_format TEXT
    CHECK (question_format IN ('standard', 'true_false', 'fill_blank', 'elimination'))
    DEFAULT 'standard';

-- 3. Identidad visual por juego (color de acento, color suave de fondo, ícono temático).
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS theme_accent TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS theme_accent_soft TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS theme_icon TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS theme_pattern TEXT;

-- ============================================================================
-- 4. Limpieza: eliminar el juego duplicado 'valle-vivo'
--    (quedaba de una iteración anterior; 'trivia-valle-cauca' es el canónico y tiene más contenido)
-- ============================================================================
DELETE FROM public.game_questions WHERE game_id = '82222222-2222-2222-2222-222222222222';
DELETE FROM public.games WHERE id = '82222222-2222-2222-2222-222222222222';

-- ============================================================================
-- 5. Corrección de bug: las 5 preguntas semilla de 'trivia-valle-cauca' guardaban
--    correct_answer como ÍNDICE numérico ('0','1','2'...) en vez del valor real de la opción.
--    El motor compara por valor, así que tal como estaban, ninguna se habría calificado bien.
-- ============================================================================
UPDATE public.game_questions SET correct_answer = '"Buga"'
    WHERE id = '93333333-3333-3333-3333-333333333331';
UPDATE public.game_questions SET correct_answer = '"Viche"'
    WHERE id = '93333333-3333-3333-3333-333333333332';
UPDATE public.game_questions SET correct_answer = '"Buenaventura"'
    WHERE id = '93333333-3333-3333-3333-333333333333';
UPDATE public.game_questions SET correct_answer = '"Bandeja Paisa"'
    WHERE id = '93333333-3333-3333-3333-333333333334';
UPDATE public.game_questions SET correct_answer = '"Parque Nacional Natural Los Farallones"'
    WHERE id = '93333333-3333-3333-3333-333333333335';

-- Asegurar que estas 5 preguntas queden con question_format explícito y en estado publicado
UPDATE public.game_questions SET question_format = 'standard', status = 'published'
    WHERE game_id = '83333333-3333-3333-3333-333333333333';

-- ============================================================================
-- 6. Identidad visual: Trivia Cali (cálida, urbana, salsera) y Valle del Cauca (verde, natural)
-- ============================================================================
UPDATE public.games SET
    theme_accent = '#E8600F',
    theme_accent_soft = '#FDECE1',
    theme_icon = 'music',
    theme_pattern = 'salsa'
WHERE id = '81111111-1111-1111-1111-111111111111';

UPDATE public.games SET
    theme_accent = '#1F9E5A',
    theme_accent_soft = '#E7F7EC',
    theme_icon = 'leaf',
    theme_pattern = 'nature',
    status = 'coming_soon' -- se mantiene inactivo hasta activación explícita, aunque ya tenga contenido cargado
WHERE id = '83333333-3333-3333-3333-333333333333';
