-- Campaña "Vocabulario" para Trivia Cali, autogenerada desde el diccionario.
-- Columna `campaign` (separa campañas del núcleo del juego) + 3 tipos de reto por término:
--   opción directa (¿qué significa X?), opción inversa (¿qué palabra significa …?) y verdadero/falso.
-- Todo con campaign='vocabulario' → el modo "Todo" no las incluye; aparecen al elegir el tema.
-- Idempotente: regenera el pack completo en cada ejecución.
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS campaign TEXT;
CREATE INDEX IF NOT EXISTS idx_game_questions_game_campaign ON public.game_questions (game_id, campaign);

DELETE FROM public.game_questions
WHERE game_id = '81111111-1111-1111-1111-111111111111' AND (campaign = 'vocabulario' OR category = 'Vocabulario');

-- 1) Opción directa: ¿qué significa el término?
INSERT INTO public.game_questions
  (game_id, question_text, question_type, question_format, category, campaign, level, options, correct_answer, explanation, status, points_reward, time_limit_sec, version)
SELECT
  '81111111-1111-1111-1111-111111111111',
  '¿Qué significa «' || e.term || '» en el habla caleña?',
  'multiple_choice', 'standard', 'Vocabulario', 'vocabulario',
  ((row_number() over (order by e.id)) % 5) + 1,
  to_jsonb((select array_agg(opt order by random()) from (
     select e.short_definition as opt
     union all
     select d.short_definition from (
        select d2.short_definition from public.dictionary_entries d2
        where d2.status='published' and d2.id <> e.id and coalesce(btrim(d2.short_definition),'')<>'' and d2.short_definition <> e.short_definition
        order by random() limit 3
     ) d
  ) all_opts)),
  to_jsonb(e.short_definition),
  coalesce(nullif(btrim(e.full_definition), ''), e.short_definition),
  'published', 10, 30, 1
FROM public.dictionary_entries e
WHERE e.status='published' and coalesce(btrim(e.short_definition),'') <> '';

-- 2) Opción inversa: dada la definición, elegir la palabra
INSERT INTO public.game_questions
  (game_id, question_text, question_type, question_format, category, campaign, level, options, correct_answer, explanation, status, points_reward, time_limit_sec, version)
SELECT
  '81111111-1111-1111-1111-111111111111',
  '¿Cuál de estas palabras caleñas significa "' || e.short_definition || '"?',
  'multiple_choice', 'standard', 'Vocabulario', 'vocabulario',
  ((row_number() over (order by e.id)) % 5) + 1,
  to_jsonb((select array_agg(opt order by random()) from (
     select e.term as opt
     union all
     select d.term from (
        select d2.term from public.dictionary_entries d2
        where d2.status='published' and d2.id <> e.id and d2.term <> e.term
        order by random() limit 3
     ) d
  ) x)),
  to_jsonb(e.term),
  coalesce(nullif(btrim(e.full_definition), ''), e.short_definition),
  'published', 10, 30, 1
FROM public.dictionary_entries e
WHERE e.status='published' and coalesce(btrim(e.short_definition),'') <> '';

-- 3) Verdadero / Falso
INSERT INTO public.game_questions
  (game_id, question_text, question_type, question_format, category, campaign, level, options, correct_answer, explanation, status, points_reward, time_limit_sec, version)
SELECT
  '81111111-1111-1111-1111-111111111111',
  '«' || e.term || '» significa: "' || case when tr.is_true then e.short_definition else w.def end || '". ¿Verdadero o falso?',
  'multiple_choice', 'true_false', 'Vocabulario', 'vocabulario',
  ((row_number() over (order by e.id)) % 5) + 1,
  '["Verdadero","Falso"]'::jsonb,
  to_jsonb(case when tr.is_true then 'Verdadero' else 'Falso' end),
  case when tr.is_true
       then 'Verdadero. ' || coalesce(nullif(btrim(e.full_definition), ''), e.short_definition)
       else 'Falso. «' || e.term || '» en realidad significa: ' || e.short_definition end,
  'published', 10, 30, 1
FROM public.dictionary_entries e
  CROSS JOIN LATERAL (select random() < 0.5 as is_true) tr
  LEFT JOIN LATERAL (
      select d.short_definition as def from public.dictionary_entries d
      where d.status='published' and d.id <> e.id and coalesce(btrim(d.short_definition),'')<>'' and d.short_definition <> e.short_definition
      order by random() limit 1
  ) w on true
WHERE e.status='published' and coalesce(btrim(e.short_definition),'')<>'' and (tr.is_true or w.def is not null);
