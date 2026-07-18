-- Fase 1 — Duelo autoritativo (modo propio)
-- ADITIVO: agrega columnas nuevas en game_challenges, la tabla challenge_runs y RPCs.
-- No altera ni elimina datos existentes. Permanece "dormido" hasta que el cliente lo use.
--
-- Modelo: el duelo es su propio modo. Se congela al crear un set de preguntas + reglas.
-- Ambos jugadores responden EL MISMO set; el servidor verifica cada respuesta, calcula
-- una puntuación canónica (independiente del modo) y resuelve el ganador. El reloj del
-- dispositivo nunca decide: los tiempos se acotan por servidor y se miden por participante.

-- 1) El duelo modo propio no reutiliza una sesión casual: aflojamos el NOT NULL heredado.
alter table public.game_challenges alter column challenger_session_id drop not null;

-- 2) Congelamiento de reglas + set + resultados derivados en servidor.
alter table public.game_challenges
  add column if not exists question_ids uuid[],
  add column if not exists ruleset jsonb,
  add column if not exists expires_at timestamptz,
  add column if not exists challenger_score int,
  add column if not exists challenged_score int,
  add column if not exists challenger_time_ms bigint,
  add column if not exists challenged_time_ms bigint;

-- 3) Una corrida por jugador, idempotente por (challenge_id, user_id).
create table if not exists public.challenge_runs (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.game_challenges(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('challenger','challenged')),
  score int not null default 0,
  total_time_ms bigint not null default 0,
  correct_count int not null default 0,
  answered_count int not null default 0,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);
create index if not exists idx_challenge_runs_challenge on public.challenge_runs(challenge_id);

alter table public.challenge_runs enable row level security;

-- Los participantes del reto pueden ver las corridas. La inserción es exclusiva de los
-- RPC SECURITY DEFINER (no hay policy de INSERT para authenticated).
drop policy if exists "Participants can view challenge runs" on public.challenge_runs;
create policy "Participants can view challenge runs" on public.challenge_runs
  for select using (
    exists (
      select 1 from public.game_challenges c
      where c.id = challenge_id
        and (c.challenger_id = auth.uid() or c.challenged_id = auth.uid())
    )
  );

grant select on public.challenge_runs to authenticated;

-- 4) create_duel: congela un set de preguntas (solo tipos de respuesta única, verificables
--    en servidor) y las reglas; devuelve las preguntas SIN la respuesta correcta.
create or replace function public.create_duel(p_game_id uuid, p_question_count int default 7)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_qids uuid[];
  v_challenge_id uuid;
  v_questions jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  select array_agg(id order by rn) into v_qids
  from (
    select id, row_number() over (order by random()) rn
    from public.game_questions
    where game_id = p_game_id
      and status = 'published'
      and question_type in ('multiple_choice','image_choice')
    limit greatest(1, least(coalesce(p_question_count,7), 15))
  ) s;

  if v_qids is null or array_length(v_qids,1) is null then
    raise exception 'NO_QUESTIONS';
  end if;

  insert into public.game_challenges (game_id, challenger_id, status, question_ids, ruleset, expires_at)
  values (
    p_game_id, v_uid, 'pending', v_qids,
    jsonb_build_object('mode','duel','scoring_version',1,
                       'question_count',array_length(v_qids,1),'per_question_seconds',20),
    now() + interval '7 days'
  )
  returning id into v_challenge_id;

  select jsonb_agg(jsonb_build_object(
      'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type,
      'options', q.options, 'category', q.category, 'level', q.level, 'time_limit_sec', q.time_limit_sec
    ) order by array_position(v_qids, q.id))
  into v_questions
  from public.game_questions q where q.id = any(v_qids);

  return jsonb_build_object(
    'challenge_id', v_challenge_id,
    'questions', v_questions,
    'ruleset', (select ruleset from public.game_challenges where id = v_challenge_id)
  );
end $$;

-- 5) get_duel_play: entrega el set congelado (sin respuestas) para que el retado juegue.
create or replace function public.get_duel_play(p_challenge_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_c public.game_challenges%rowtype;
  v_questions jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_challenges where id = p_challenge_id;
  if not found then raise exception 'NOT_FOUND'; end if;
  if v_c.status <> 'pending' then raise exception 'CLOSED'; end if;
  if v_c.expires_at is not null and v_c.expires_at < now() then raise exception 'EXPIRED'; end if;

  select jsonb_agg(jsonb_build_object(
      'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type,
      'options', q.options, 'category', q.category, 'level', q.level, 'time_limit_sec', q.time_limit_sec
    ) order by array_position(v_c.question_ids, q.id))
  into v_questions
  from public.game_questions q where q.id = any(v_c.question_ids);

  return jsonb_build_object(
    'challenge_id', v_c.id, 'game_id', v_c.game_id,
    'questions', v_questions, 'ruleset', v_c.ruleset
  );
end $$;

-- Resolución interna: gana mayor puntaje; desempata menor tiempo; empate => winner_id null.
create or replace function public._resolve_duel(p_challenge_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  r_ch public.challenge_runs%rowtype;
  r_cd public.challenge_runs%rowtype;
  v_found_ch boolean; v_found_cd boolean;
  v_winner uuid;
begin
  select * into r_ch from public.challenge_runs where challenge_id = p_challenge_id and role = 'challenger';
  v_found_ch := found;
  select * into r_cd from public.challenge_runs where challenge_id = p_challenge_id and role = 'challenged';
  v_found_cd := found;
  if not (v_found_ch and v_found_cd) then return; end if;

  if r_ch.score > r_cd.score then v_winner := r_ch.user_id;
  elsif r_cd.score > r_ch.score then v_winner := r_cd.user_id;
  elsif r_ch.total_time_ms < r_cd.total_time_ms then v_winner := r_ch.user_id;
  elsif r_cd.total_time_ms < r_ch.total_time_ms then v_winner := r_cd.user_id;
  else v_winner := null;
  end if;

  update public.game_challenges
    set status = 'completed', winner_id = v_winner, completed_at = now()
    where id = p_challenge_id and status <> 'completed';
end $$;

-- 6) submit_duel_run: verifica cada respuesta contra el set congelado, registra la corrida
--    (idempotente) y resuelve cuando ambos jugaron. p_answers = [{question_id, selected, time_ms}]
create or replace function public.submit_duel_run(p_challenge_id uuid, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_c public.game_challenges%rowtype;
  v_role text;
  v_score int := 0;
  v_time bigint := 0;
  v_correct int := 0;
  v_answered int := 0;
  v_rec jsonb := '[]'::jsonb;
  a jsonb;
  v_q public.game_questions%rowtype;
  v_sel text;
  v_ok boolean;
  v_cap int;
  v_both boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_challenges where id = p_challenge_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if v_c.status <> 'pending' then raise exception 'CLOSED'; end if;
  if v_c.expires_at is not null and v_c.expires_at < now() then raise exception 'EXPIRED'; end if;

  -- Rol + asignación del retado la primera vez que responde.
  if v_uid = v_c.challenger_id then
    v_role := 'challenger';
  else
    v_role := 'challenged';
    if v_c.challenged_id is null then
      update public.game_challenges set challenged_id = v_uid where id = p_challenge_id;
    elsif v_c.challenged_id <> v_uid then
      raise exception 'NOT_A_PARTICIPANT';
    end if;
  end if;

  -- Idempotencia: si ya registró su corrida, devolvemos sin duplicar.
  if exists (select 1 from public.challenge_runs where challenge_id = p_challenge_id and user_id = v_uid) then
    return jsonb_build_object('status','already_submitted');
  end if;

  for a in select * from jsonb_array_elements(coalesce(p_answers,'[]'::jsonb))
  loop
    if not ((a->>'question_id')::uuid = any(v_c.question_ids)) then continue; end if;
    select * into v_q from public.game_questions where id = (a->>'question_id')::uuid;
    if not found then continue; end if;
    v_sel := a->>'selected';
    v_ok := v_sel is not null and (v_q.correct_answer #>> '{}') = v_sel;
    v_cap := coalesce(v_q.time_limit_sec, 30) * 1000;
    v_answered := v_answered + 1;
    v_time := v_time + least(coalesce((a->>'time_ms')::bigint, v_cap), v_cap);
    if v_ok then
      v_correct := v_correct + 1;
      v_score := v_score + coalesce(v_q.points_reward, 0);
    end if;
    v_rec := v_rec || jsonb_build_object('question_id', a->>'question_id', 'selected', v_sel, 'is_correct', v_ok);
  end loop;

  insert into public.challenge_runs (challenge_id, user_id, role, score, total_time_ms, correct_count, answered_count, answers)
  values (p_challenge_id, v_uid, v_role, v_score, v_time, v_correct, v_answered, v_rec);

  if v_role = 'challenger' then
    update public.game_challenges set challenger_score = v_score, challenger_time_ms = v_time where id = p_challenge_id;
  else
    update public.game_challenges set challenged_score = v_score, challenged_time_ms = v_time where id = p_challenge_id;
  end if;

  select count(*) = 2 into v_both from public.challenge_runs where challenge_id = p_challenge_id;
  if v_both then perform public._resolve_duel(p_challenge_id); end if;

  return jsonb_build_object('status','ok','role',v_role,'score',v_score,
                           'correct',v_correct,'answered',v_answered,'time_ms',v_time,
                           'resolved', v_both);
end $$;

-- Grants: solo RPC públicos a authenticated; el helper de resolución queda interno.
grant execute on function public.create_duel(uuid, int) to authenticated;
grant execute on function public.get_duel_play(uuid) to authenticated;
grant execute on function public.submit_duel_run(uuid, jsonb) to authenticated;
revoke all on function public._resolve_duel(uuid) from public;
