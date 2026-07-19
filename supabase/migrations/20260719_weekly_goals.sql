-- Fase 2 — Metas semanales flexibles. ADITIVO.
-- Metas que toleran ausencias (manual §4.2): el progreso se CALCULA de datos existentes
-- (daily_question_attempts, game_sessions) — sin nuevas rutas de escritura. Semana = lunes a
-- domingo en America/Bogota. El premio se reclama explícitamente; el reclamo queda registrado
-- (weekly_goal_claims) y el abono pasa por el ledger con clave idempotente.
-- Metas v1 (definiciones en _weekly_goals_progress, única fuente):
--   daily_days: responder la Pregunta del día 4 de 7 días  -> 40 monedas
--   games_completed: completar 3 partidas en la semana     -> 30 monedas

create table if not exists public.weekly_goal_claims (
  user_id uuid not null,
  week_start date not null,
  goal_key text not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, week_start, goal_key)
);

alter table public.weekly_goal_claims enable row level security;
drop policy if exists "own weekly claims" on public.weekly_goal_claims;
create policy "own weekly claims" on public.weekly_goal_claims for select using (auth.uid() = user_id);
grant select on public.weekly_goal_claims to authenticated;

-- Única fuente de las definiciones + progreso calculado.
create or replace function public._weekly_goals_progress(p_user uuid, p_week_start date)
returns table(goal_key text, title text, description text, target int, reward_coins int, progress int)
language sql stable security definer set search_path = public as $$
  values
    ('daily_days', 'Constancia', 'Respondé la Pregunta del día 4 días esta semana', 4, 40,
      (select count(distinct a.day)::int from public.daily_question_attempts a
        where a.user_id = p_user and a.day >= p_week_start and a.day < p_week_start + 7)),
    ('games_completed', 'A jugar', 'Completá 3 partidas de trivia esta semana', 3, 30,
      (select count(*)::int from public.game_sessions s
        where s.user_id = p_user and s.status = 'completed'
          and (s.completed_at at time zone 'America/Bogota')::date >= p_week_start
          and (s.completed_at at time zone 'America/Bogota')::date < p_week_start + 7))
$$;

create or replace function public.get_weekly_goals()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_week date := date_trunc('week', (now() at time zone 'America/Bogota'))::date;
  v_goals jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select jsonb_agg(jsonb_build_object(
      'key', g.goal_key, 'title', g.title, 'description', g.description,
      'target', g.target, 'reward_coins', g.reward_coins,
      'progress', least(g.progress, g.target),
      'completed', g.progress >= g.target,
      'claimed', exists (select 1 from public.weekly_goal_claims c
                         where c.user_id = v_uid and c.week_start = v_week and c.goal_key = g.goal_key)
    ) order by g.goal_key)
  into v_goals
  from public._weekly_goals_progress(v_uid, v_week) g;

  return jsonb_build_object('week_start', v_week, 'week_end', v_week + 6, 'goals', coalesce(v_goals, '[]'::jsonb));
end $$;

create or replace function public.claim_weekly_goal(p_goal_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_week date := date_trunc('week', (now() at time zone 'America/Bogota'))::date;
  g record;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into g from public._weekly_goals_progress(v_uid, v_week) where goal_key = p_goal_key;
  if not found then raise exception 'UNKNOWN_GOAL'; end if;
  if g.progress < g.target then raise exception 'NOT_COMPLETED'; end if;

  -- Registro del reclamo (una vez por semana/meta).
  insert into public.weekly_goal_claims (user_id, week_start, goal_key)
  values (v_uid, v_week, p_goal_key)
  on conflict (user_id, week_start, goal_key) do nothing;
  if not found then
    return jsonb_build_object('already_claimed', true);
  end if;

  perform economy.apply_rewards(
    v_uid, 0::bigint, 0::bigint, g.reward_coins::bigint, 0::bigint,
    'weekly_goal', 'weekly', v_week::text || ':' || p_goal_key,
    'weekly:' || v_uid::text || ':' || v_week::text || ':' || p_goal_key,
    jsonb_build_object('goal', p_goal_key, 'target', g.target)
  );

  return jsonb_build_object('claimed', true, 'coins', g.reward_coins);
end $$;

revoke all on function public._weekly_goals_progress(uuid, date) from public;
grant execute on function public.get_weekly_goals() to authenticated;
grant execute on function public.claim_weekly_goal(text) to authenticated;
