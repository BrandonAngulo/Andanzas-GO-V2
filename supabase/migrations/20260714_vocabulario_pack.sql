-- Pack de campaña "Vocabulario" para Trivia Cali, autogenerado desde el diccionario.
-- Una pregunta por término publicado: definición correcta + 3 distractores aleatorios
-- de otras entradas, opciones barajadas. Niveles 1-5 repartidos (sirve mezclado o por tema).
-- Idempotente: regenera el pack en cada ejecución.
delete from public.game_questions
where game_id = '81111111-1111-1111-1111-111111111111' and category = 'Vocabulario';

insert into public.game_questions
  (game_id, question_text, question_type, question_format, category, level, options, correct_answer, explanation, status, points_reward, time_limit_sec, version)
select
  '81111111-1111-1111-1111-111111111111',
  '¿Qué significa «' || e.term || '» en el habla caleña?',
  'multiple_choice', 'standard', 'Vocabulario',
  ((row_number() over (order by e.id)) % 5) + 1,
  to_jsonb((
     select array_agg(opt order by random())
     from (
        select e.short_definition as opt
        union all
        select d.short_definition
        from (
           select d2.short_definition
           from public.dictionary_entries d2
           where d2.status = 'published' and d2.id <> e.id
             and coalesce(btrim(d2.short_definition), '') <> ''
             and d2.short_definition <> e.short_definition
           order by random()
           limit 3
        ) d
     ) all_opts
  )),
  to_jsonb(e.short_definition),
  coalesce(nullif(btrim(e.full_definition), ''), e.short_definition),
  'published', 10, 30, 1
from public.dictionary_entries e
where e.status = 'published' and coalesce(btrim(e.short_definition), '') <> '';
