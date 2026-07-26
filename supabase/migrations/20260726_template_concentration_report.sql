-- pg_trgm para medir similitud de texto entre preguntas (detección de plantillas/near-dups).
create extension if not exists pg_trgm;

-- Reporte de concentración de plantillas por categoría (monotonía del banco).
-- "con_gemela" = preguntas que tienen otra muy parecida (misma forma) en su categoría.
-- Usado por el panel admin de Juegos → Analítica.
create or replace function public.get_template_concentration(p_game_id uuid)
returns table(category text, total bigint, con_gemela bigint, pct_monotonia numeric)
language sql
stable
set search_path to 'public', 'pg_temp'
as $function$
  with q as (
    select id, category, question_text
    from public.game_questions
    where game_id = p_game_id and status = 'published' and category is not null
  ),
  twins as (
    select distinct a.id, a.category
    from q a
    join q b on a.category = b.category and a.id <> b.id
    where similarity(a.question_text, b.question_text) > 0.5
  )
  select q.category,
    count(distinct q.id) as total,
    count(distinct t.id) as con_gemela,
    round(100.0 * count(distinct t.id) / nullif(count(distinct q.id), 0), 0) as pct_monotonia
  from q
  left join twins t on t.id = q.id
  group by q.category
  having count(distinct q.id) >= 5
  order by round(100.0 * count(distinct t.id) / nullif(count(distinct q.id), 0), 0) desc nulls last, count(distinct q.id) desc;
$function$;

grant execute on function public.get_template_concentration(uuid) to authenticated;
