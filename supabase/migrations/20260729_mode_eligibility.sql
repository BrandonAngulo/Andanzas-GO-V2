-- Elegibilidad de preguntas por MODO de juego.
-- Modelo: regla por defecto (automática) + override manual por pregunta.
-- Al sumar más preguntas se clasifican solas; los ajustes finos van por override
-- o tocando la regla. La elegibilidad NO se guarda como JSON dentro de la pregunta:
-- es una relación administrable y auditable (bloque 3, secc. 7 del plan).
-- Aplicado en Supabase V3 vía apply_migration (mismos nombres):
--   mode_eligibility_foundation, mode_eligibility_wire_rpcs, mode_pool_sizes_rpc.

-- 1) Regla por defecto (pura, sin overrides).
create or replace function public.fn_mode_default_eligible(q public.game_questions, p_mode text)
returns boolean language sql immutable as $$
  select case p_mode
    when 'reto'         then q.status = 'published'
    when 'practica'     then q.status = 'published'
    when 'contrarreloj' then q.status = 'published' and q.question_type = 'multiple_choice'
    when 'duelo'        then q.status = 'published'
                                and q.question_type in ('multiple_choice','image_choice')
                                and q.explanation is not null and length(btrim(q.explanation)) > 0
    when 'diaria'       then q.status = 'published' and q.question_type = 'multiple_choice'
                                and q.explanation is not null and length(btrim(q.explanation)) > 0
                                and coalesce(q.level, 1) <= 3
    when 'aventura'     then false  -- solo por asignación a capítulo (otro frente)
    else false
  end;
$$;

-- 2) Overrides manuales (excepciones a la regla). Auditable.
create table if not exists public.game_mode_eligibility (
  question_id uuid not null references public.game_questions(id) on delete cascade,
  mode text not null check (mode in ('reto','contrarreloj','duelo','diaria','practica','aventura')),
  eligible boolean not null,
  note text,
  updated_by uuid default auth.uid(),
  updated_at timestamptz not null default now(),
  primary key (question_id, mode)
);
create index if not exists idx_game_mode_elig_mode on public.game_mode_eligibility(mode) where eligible = false;
alter table public.game_mode_eligibility enable row level security;
drop policy if exists game_mode_elig_staff_all on public.game_mode_eligibility;
create policy game_mode_elig_staff_all on public.game_mode_eligibility
  for all using (public.is_staff()) with check (public.is_staff());

-- 3) Elegibilidad EFECTIVA (override si existe; si no, la regla).
create or replace function public.fn_mode_eligible(p_question_id uuid, p_mode text)
returns boolean language sql stable as $$
  select coalesce(
    (select e.eligible from public.game_mode_eligibility e
       where e.question_id = p_question_id and e.mode = p_mode),
    (select public.fn_mode_default_eligible(q, p_mode)
       from public.game_questions q where q.id = p_question_id)
  );
$$;

-- 4) Vista efectiva por pregunta x modo (para admin y analítica).
create or replace view public.v_question_mode_eligibility as
select q.id as question_id, q.game_id, q.question_type, q.level, q.category, q.campaign,
       m.mode,
       coalesce(o.eligible, public.fn_mode_default_eligible(q, m.mode)) as eligible,
       case when o.question_id is not null then 'override' else 'rule' end as source,
       o.note
from public.game_questions q
cross join (values ('reto'),('contrarreloj'),('duelo'),('diaria'),('practica'),('aventura')) m(mode)
left join public.game_mode_eligibility o on o.question_id = q.id and o.mode = m.mode
where q.status = 'published';

-- 5) Tamaños de pool elegible por modo (panel admin).
create or replace function public.get_mode_pool_sizes(p_game_id uuid)
returns table(mode text, elegibles bigint, publicadas bigint, overrides bigint)
language sql stable set search_path to 'public' as $$
  select v.mode,
         count(*) filter (where v.eligible) as elegibles,
         count(*) as publicadas,
         count(*) filter (where v.source = 'override') as overrides
  from public.v_question_mode_eligibility v
  where v.game_id = p_game_id
  group by v.mode
  order by elegibles desc;
$$;

-- 6) compose_game_questions: nuevo parámetro p_mode + filtro de elegibilidad efectiva.
drop function if exists public.compose_game_questions(uuid, uuid, integer, text);
create or replace function public.compose_game_questions(
  p_game_id uuid, p_user_id uuid default null::uuid, p_limit integer default 15,
  p_theme text default null::text, p_mode text default 'reto'::text)
returns setof game_questions language sql
set search_path to 'public','pg_temp' as $function$
  SELECT q.* FROM public.game_questions q
  LEFT JOIN public.question_performance_metrics m ON m.question_id = q.id
  LEFT JOIN public.game_mode_eligibility elig ON elig.question_id = q.id AND elig.mode = p_mode
  LEFT JOIN LATERAL (
    SELECT avg(utm.mastery) mastery FROM public.question_topic_links l
    JOIN public.user_topic_mastery utm ON utm.topic_id = l.topic_id AND utm.user_id = p_user_id
    WHERE l.question_id = q.id
  ) u ON true
  LEFT JOIN LATERAL (
    SELECT max(a.answered_at) last_seen FROM public.game_answers a
    JOIN public.game_sessions s ON s.id = a.session_id
    WHERE a.question_id = q.id AND s.user_id = p_user_id AND s.game_id = p_game_id
  ) seen ON true
  WHERE q.game_id = p_game_id AND q.status = 'published'
    AND coalesce(elig.eligible, public.fn_mode_default_eligible(q, p_mode))
    AND (p_theme IS NULL OR p_theme = 'all' OR q.category = p_theme OR q.campaign = p_theme)
  ORDER BY
    (
      (CASE WHEN seen.last_seen IS NULL THEN 0 ELSE 100 END)
      + CASE WHEN seen.last_seen IS NULL THEN 0
             ELSE greatest(0, 20 - extract(epoch from (now() - seen.last_seen)) / 86400) END
      + abs(coalesce(m.empirical_difficulty, greatest(0.05, least(0.95, (q.level - 1) / 4.0))) - (1 - coalesce(u.mastery, 0.5))) * 3
      - random() * 10
    ) ASC,
    q.level
  LIMIT greatest(1, least(coalesce(p_limit, 15), 500));
$function$;

-- 7) create_duel: usar elegibilidad 'duelo'. 8) _ensure_daily_question: elegibilidad 'diaria'.
-- (Cuerpos completos aplicados en la BD; ver apply_migration mode_eligibility_wire_rpcs.)
