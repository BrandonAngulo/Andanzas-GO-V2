alter table public.game_sessions
  add column if not exists mode_key text not null default 'reto',
  add column if not exists theme_key text;

comment on column public.game_sessions.mode_key is
  'Player-facing TRIVIA GO modality (clasica, contrarreloj, lugar, vocabulario, historia or reto).';
comment on column public.game_sessions.theme_key is
  'Optional playable scope or topic used to compose this session.';

create index if not exists idx_game_sessions_user_mode_theme_recent
  on public.game_sessions (user_id, game_id, mode_key, theme_key, completed_at desc);

create or replace function public.get_my_game_mode_summary(
  p_game_id uuid,
  p_mode_key text,
  p_theme_key text default null
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'started', count(*),
    'completed', count(*) filter (where s.status = 'completed'),
    'best_score', coalesce(max(s.total_score) filter (where s.status = 'completed'), 0),
    'best_accuracy', coalesce(round(max(s.accuracy_percent) filter (where s.status = 'completed'), 1), 0),
    'total_correct', coalesce(sum(s.correct_answers) filter (where s.status = 'completed'), 0),
    'total_answered', coalesce(sum(s.answered_questions) filter (where s.status = 'completed'), 0),
    'best_streak', coalesce(max(s.max_correct_streak) filter (where s.status = 'completed'), 0),
    'last_played_at', max(coalesce(s.completed_at, s.started_at))
  )
  from public.game_sessions s
  where s.user_id = (select auth.uid())
    and s.game_id = p_game_id
    and s.mode_key = p_mode_key
    and s.theme_key is not distinct from p_theme_key;
$$;

revoke all on function public.get_my_game_mode_summary(uuid, text, text) from public, anon;
grant execute on function public.get_my_game_mode_summary(uuid, text, text) to authenticated;

create or replace function public.get_game_session_mode_metrics(p_game_id uuid)
returns table (
  mode_key text,
  theme_key text,
  started bigint,
  completed bigint,
  average_accuracy numeric,
  best_score integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_staff() then
    raise exception 'INSUFFICIENT_PRIVILEGE';
  end if;

  return query
  select
    s.mode_key,
    s.theme_key,
    count(*)::bigint,
    count(*) filter (where s.status = 'completed')::bigint,
    coalesce(round(avg(s.accuracy_percent) filter (where s.status = 'completed'), 1), 0),
    coalesce(max(s.total_score) filter (where s.status = 'completed'), 0)::integer
  from public.game_sessions s
  where s.game_id = p_game_id
  group by s.mode_key, s.theme_key
  order by count(*) desc, s.mode_key, s.theme_key;
end;
$$;

revoke all on function public.get_game_session_mode_metrics(uuid) from public, anon;
grant execute on function public.get_game_session_mode_metrics(uuid) to authenticated;
