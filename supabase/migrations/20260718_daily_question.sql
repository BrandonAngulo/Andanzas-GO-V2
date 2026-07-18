-- Fase 2 — Pregunta del día (v1). ADITIVO.
-- Una pregunta global por día (día = fecha en America/Bogota, resuelve viajeros de forma
-- consistente). Verificación en servidor, una respuesta por usuario/día (idempotente,
-- anti-abuso), racha de participación con 1 día de gracia, explicación al final,
-- anti-repetición (no repite pregunta usada como diaria en los últimos 60 días).
-- Recompensas económicas: pendientes para el siguiente incremento (aquí solo racha + aprendizaje).

-- Pregunta asignada a cada día (editores pueden pre-programar; si falta, se auto-asigna).
create table if not exists public.daily_questions (
  day date primary key,
  question_id uuid not null references public.game_questions(id),
  game_id uuid,
  created_at timestamptz not null default now()
);

-- Intento del usuario (una por día).
create table if not exists public.daily_question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  day date not null,
  question_id uuid not null,
  selected text,
  is_correct boolean not null default false,
  answered_at timestamptz not null default now(),
  unique (user_id, day)
);
create index if not exists idx_daily_attempts_user on public.daily_question_attempts(user_id);

-- Estado de racha por usuario.
create table if not exists public.user_daily_state (
  user_id uuid primary key,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_day date
);

alter table public.daily_questions enable row level security;
alter table public.daily_question_attempts enable row level security;
alter table public.user_daily_state enable row level security;

drop policy if exists "daily_questions readable" on public.daily_questions;
create policy "daily_questions readable" on public.daily_questions for select using (true);

drop policy if exists "own daily attempts" on public.daily_question_attempts;
create policy "own daily attempts" on public.daily_question_attempts for select using (auth.uid() = user_id);

drop policy if exists "own daily state" on public.user_daily_state;
create policy "own daily state" on public.user_daily_state for select using (auth.uid() = user_id);

grant select on public.daily_questions to authenticated;
grant select on public.daily_question_attempts to authenticated;
grant select on public.user_daily_state to authenticated;

-- Asegura (o auto-asigna) la pregunta del día. Interno.
create or replace function public._ensure_daily_question(p_day date)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_qid uuid;
begin
  insert into public.daily_questions (day, question_id, game_id)
  select p_day, q.id, q.game_id
  from public.game_questions q
  where q.status = 'published' and q.question_type = 'multiple_choice'
    and not exists (select 1 from public.daily_questions d where d.question_id = q.id and d.day > p_day - 60)
  order by random() limit 1
  on conflict (day) do nothing;
  select question_id into v_qid from public.daily_questions where day = p_day;
  return v_qid;
end $$;

-- Devuelve la pregunta del día (sin respuesta si no ha respondido; con review si ya respondió).
create or replace function public.get_daily_question()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_qid uuid; v_q public.game_questions%rowtype;
  v_att public.daily_question_attempts%rowtype; v_answered boolean;
  v_state public.user_daily_state%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_qid := public._ensure_daily_question(v_day);
  if v_qid is null then raise exception 'NO_QUESTIONS'; end if;
  select * into v_q from public.game_questions where id = v_qid;

  select * into v_att from public.daily_question_attempts where user_id = v_uid and day = v_day;
  v_answered := found;
  select * into v_state from public.user_daily_state where user_id = v_uid;

  return jsonb_build_object(
    'day', v_day,
    'answered', v_answered,
    'streak', coalesce(v_state.current_streak, 0),
    'best_streak', coalesce(v_state.best_streak, 0),
    'question', jsonb_build_object('id', v_q.id, 'question_text', v_q.question_text,
      'question_type', v_q.question_type, 'options', v_q.options, 'category', v_q.category),
    'review', case when v_answered then jsonb_build_object(
        'selected', v_att.selected, 'correct_answer', v_q.correct_answer,
        'is_correct', v_att.is_correct, 'explanation', v_q.explanation) else null end
  );
end $$;

-- Registra la respuesta del día (idempotente), verifica en servidor y actualiza la racha.
create or replace function public.answer_daily_question(p_selected text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_qid uuid; v_q public.game_questions%rowtype; v_ok boolean;
  v_state public.user_daily_state%rowtype; v_new int; v_best int;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_qid := public._ensure_daily_question(v_day);
  if v_qid is null then raise exception 'NO_QUESTIONS'; end if;
  select * into v_q from public.game_questions where id = v_qid;

  if exists (select 1 from public.daily_question_attempts where user_id = v_uid and day = v_day) then
    select * into v_state from public.user_daily_state where user_id = v_uid;
    return jsonb_build_object('already_answered', true, 'streak', coalesce(v_state.current_streak, 0),
      'correct_answer', v_q.correct_answer, 'explanation', v_q.explanation);
  end if;

  v_ok := p_selected is not null and (v_q.correct_answer #>> '{}') = p_selected;
  insert into public.daily_question_attempts (user_id, day, question_id, selected, is_correct)
  values (v_uid, v_day, v_qid, p_selected, v_ok);

  select * into v_state from public.user_daily_state where user_id = v_uid;
  if not found then
    v_new := 1;
  elsif v_state.last_day = v_day - 1 or v_state.last_day = v_day - 2 then
    v_new := coalesce(v_state.current_streak, 0) + 1; -- consecutivo o con 1 día de gracia
  elsif v_state.last_day = v_day then
    v_new := coalesce(v_state.current_streak, 1);
  else
    v_new := 1; -- se rompió la racha
  end if;
  v_best := greatest(coalesce(v_state.best_streak, 0), v_new);

  insert into public.user_daily_state (user_id, current_streak, best_streak, last_day)
  values (v_uid, v_new, v_best, v_day)
  on conflict (user_id) do update set current_streak = v_new, best_streak = v_best, last_day = v_day;

  return jsonb_build_object('is_correct', v_ok, 'correct_answer', v_q.correct_answer,
    'explanation', v_q.explanation, 'streak', v_new, 'best_streak', v_best);
end $$;

revoke all on function public._ensure_daily_question(date) from public;
grant execute on function public.get_daily_question() to authenticated;
grant execute on function public.answer_daily_question(text) to authenticated;
