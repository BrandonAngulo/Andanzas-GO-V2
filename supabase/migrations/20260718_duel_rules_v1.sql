-- Fase 1 — Reglas del Duelo estándar v1 (ajusta la migración de duelo autoritativo).
-- ADITIVO/no destructivo: amplía el CHECK de status, agrega columnas de "correctas" y
-- reemplaza los RPC (create or replace) con las reglas definitivas de v1.
--
-- Reglas v1: 10 preguntas · reloj global de 180s (sin límite por pregunta) · una respuesta
-- incorrecta NO termina · fin al responder 10, agotar 180s o abandonar · pendientes al
-- agotar el tiempo cuentan como incorrectas · explicaciones al final · gana más correctas,
-- luego puntaje, luego menor tiempo · enlace vence a 7 días · muerte súbita = modificador futuro.
-- Estados: draft -> awaiting_opponent -> in_progress -> completed (+ cancelled/expired/invalidated).
-- El enlace del rival solo se habilita cuando el retador termina (status awaiting_opponent).

-- 1) Ampliar estados permitidos (conserva 'pending' por compatibilidad con el flujo viejo).
alter table public.game_challenges drop constraint if exists game_challenges_status_check;
alter table public.game_challenges add constraint game_challenges_status_check
  check (status in ('pending','draft','awaiting_opponent','in_progress','completed','cancelled','expired','invalidated'));

-- 2) Correctas por lado (métrica primaria del veredicto).
alter table public.game_challenges
  add column if not exists challenger_correct int,
  add column if not exists challenged_correct int;

-- 3) create_duel: 10 preguntas por defecto, reloj global 180s, arranca en 'draft'.
create or replace function public.create_duel(p_game_id uuid, p_question_count int default 10)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_qids uuid[];
  v_challenge_id uuid;
  v_questions jsonb;
  v_n int := greatest(1, least(coalesce(p_question_count,10), 20));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  select array_agg(id order by rn) into v_qids
  from (
    select id, row_number() over (order by random()) rn
    from public.game_questions
    where game_id = p_game_id and status = 'published'
      and question_type in ('multiple_choice','image_choice')
    limit v_n
  ) s;

  if v_qids is null or array_length(v_qids,1) is null then raise exception 'NO_QUESTIONS'; end if;

  insert into public.game_challenges (game_id, challenger_id, status, question_ids, ruleset, expires_at)
  values (
    p_game_id, v_uid, 'draft', v_qids,
    jsonb_build_object('mode','duel','scoring_version',1,
                       'question_count',array_length(v_qids,1),'round_seconds',180),
    now() + interval '7 days'
  )
  returning id into v_challenge_id;

  select jsonb_agg(jsonb_build_object(
      'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type,
      'options', q.options, 'category', q.category, 'level', q.level
    ) order by array_position(v_qids, q.id))
  into v_questions
  from public.game_questions q where q.id = any(v_qids);

  return jsonb_build_object('challenge_id', v_challenge_id, 'questions', v_questions,
    'ruleset', (select ruleset from public.game_challenges where id = v_challenge_id));
end $$;

-- 4) get_duel_play: SOLO el rival, y SOLO cuando el retador terminó (awaiting_opponent).
--    Marca in_progress y reclama el duelo para ese rival. Vencimiento perezoso.
create or replace function public.get_duel_play(p_challenge_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_c public.game_challenges%rowtype;
  v_questions jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_challenges where id = p_challenge_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;

  if v_c.expires_at is not null and v_c.expires_at < now() and v_c.status <> 'completed' then
    update public.game_challenges set status='expired' where id=p_challenge_id;
    raise exception 'EXPIRED';
  end if;
  if v_uid = v_c.challenger_id then raise exception 'IS_CHALLENGER'; end if;
  if v_c.status not in ('awaiting_opponent','in_progress') then raise exception 'NOT_READY'; end if;
  if v_c.challenged_id is not null and v_c.challenged_id <> v_uid then raise exception 'ALREADY_TAKEN'; end if;

  update public.game_challenges
    set status='in_progress', challenged_id = coalesce(challenged_id, v_uid)
    where id=p_challenge_id;

  select jsonb_agg(jsonb_build_object(
      'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type,
      'options', q.options, 'category', q.category, 'level', q.level
    ) order by array_position(v_c.question_ids, q.id))
  into v_questions
  from public.game_questions q where q.id = any(v_c.question_ids);

  return jsonb_build_object('challenge_id', v_c.id, 'game_id', v_c.game_id,
    'questions', v_questions, 'ruleset', v_c.ruleset);
end $$;

-- 5) Resolución: gana MÁS correctas; luego mayor puntaje; luego menor tiempo; si todo empata, null.
create or replace function public._resolve_duel(p_challenge_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  r_ch public.challenge_runs%rowtype;
  r_cd public.challenge_runs%rowtype;
  v_found_ch boolean; v_found_cd boolean;
  v_winner uuid;
begin
  select * into r_ch from public.challenge_runs where challenge_id = p_challenge_id and role='challenger';
  v_found_ch := found;
  select * into r_cd from public.challenge_runs where challenge_id = p_challenge_id and role='challenged';
  v_found_cd := found;
  if not (v_found_ch and v_found_cd) then return; end if;

  if r_ch.correct_count <> r_cd.correct_count then
    v_winner := case when r_ch.correct_count > r_cd.correct_count then r_ch.user_id else r_cd.user_id end;
  elsif r_ch.score <> r_cd.score then
    v_winner := case when r_ch.score > r_cd.score then r_ch.user_id else r_cd.user_id end;
  elsif r_ch.total_time_ms <> r_cd.total_time_ms then
    v_winner := case when r_ch.total_time_ms < r_cd.total_time_ms then r_ch.user_id else r_cd.user_id end;
  else v_winner := null;
  end if;

  update public.game_challenges
    set status='completed', winner_id = v_winner, completed_at = now()
    where id = p_challenge_id and status <> 'completed';
end $$;

-- 6) submit_duel_run: verifica en servidor, reloj global 180s (sin cap por pregunta),
--    transiciones de estado y resolución. Retador: draft -> awaiting_opponent.
create or replace function public.submit_duel_run(p_challenge_id uuid, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_c public.game_challenges%rowtype;
  v_role text;
  v_score int := 0; v_time bigint := 0; v_correct int := 0; v_answered int := 0;
  v_rec jsonb := '[]'::jsonb;
  a jsonb; v_q public.game_questions%rowtype; v_sel text; v_ok boolean;
  v_round_ms bigint; v_both boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_challenges where id = p_challenge_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;

  if v_c.expires_at is not null and v_c.expires_at < now() and v_c.status <> 'completed' then
    update public.game_challenges set status='expired' where id=p_challenge_id;
    raise exception 'EXPIRED';
  end if;

  if v_uid = v_c.challenger_id then
    v_role := 'challenger';
    if v_c.status <> 'draft' then raise exception 'INVALID_STATE'; end if;
  else
    v_role := 'challenged';
    if v_c.status not in ('awaiting_opponent','in_progress') then raise exception 'INVALID_STATE'; end if;
    if v_c.challenged_id is null then
      update public.game_challenges set challenged_id = v_uid where id = p_challenge_id;
    elsif v_c.challenged_id <> v_uid then
      raise exception 'NOT_A_PARTICIPANT';
    end if;
  end if;

  if exists (select 1 from public.challenge_runs where challenge_id = p_challenge_id and user_id = v_uid) then
    return jsonb_build_object('status','already_submitted');
  end if;

  v_round_ms := coalesce((v_c.ruleset->>'round_seconds')::int, 180) * 1000;

  for a in select * from jsonb_array_elements(coalesce(p_answers,'[]'::jsonb))
  loop
    if not ((a->>'question_id')::uuid = any(v_c.question_ids)) then continue; end if;
    select * into v_q from public.game_questions where id = (a->>'question_id')::uuid;
    if not found then continue; end if;
    v_sel := a->>'selected';
    v_ok := v_sel is not null and (v_q.correct_answer #>> '{}') = v_sel;
    v_answered := v_answered + 1;
    v_time := v_time + greatest(coalesce((a->>'time_ms')::bigint,0),0);
    if v_ok then v_correct := v_correct + 1; v_score := v_score + coalesce(v_q.points_reward,0); end if;
    v_rec := v_rec || jsonb_build_object('question_id', a->>'question_id', 'selected', v_sel, 'is_correct', v_ok);
  end loop;

  v_time := least(v_time, v_round_ms); -- reloj global: el total no excede la ronda

  insert into public.challenge_runs (challenge_id, user_id, role, score, total_time_ms, correct_count, answered_count, answers)
  values (p_challenge_id, v_uid, v_role, v_score, v_time, v_correct, v_answered, v_rec);

  if v_role = 'challenger' then
    update public.game_challenges
      set challenger_score=v_score, challenger_time_ms=v_time, challenger_correct=v_correct, status='awaiting_opponent'
      where id=p_challenge_id;
  else
    update public.game_challenges
      set challenged_score=v_score, challenged_time_ms=v_time, challenged_correct=v_correct
      where id=p_challenge_id;
  end if;

  select count(*) = 2 into v_both from public.challenge_runs where challenge_id = p_challenge_id;
  if v_both then perform public._resolve_duel(p_challenge_id); end if;

  return jsonb_build_object('status','ok','role',v_role,'correct',v_correct,'score',v_score,
                           'answered',v_answered,'time_ms',v_time,'resolved',v_both);
end $$;

-- 7) cancel_duel: el retador cancela mientras no esté cerrado.
create or replace function public.cancel_duel(p_challenge_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_c public.game_challenges%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_challenges where id=p_challenge_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if v_uid <> v_c.challenger_id then raise exception 'NOT_OWNER'; end if;
  if v_c.status in ('completed','cancelled','expired','invalidated') then raise exception 'INVALID_STATE'; end if;
  update public.game_challenges set status='cancelled' where id=p_challenge_id;
  return jsonb_build_object('status','cancelled');
end $$;

grant execute on function public.create_duel(uuid, int) to authenticated;
grant execute on function public.get_duel_play(uuid) to authenticated;
grant execute on function public.submit_duel_run(uuid, jsonb) to authenticated;
grant execute on function public.cancel_duel(uuid) to authenticated;
revoke all on function public._resolve_duel(uuid) from public;
