-- Duelo: una pregunta sin respuesta termina la corrida y cuenta como derrota por tiempo.
-- El servidor persiste el abandono y lo prioriza al resolver el ganador.

alter table public.challenge_runs
  add column if not exists forfeited boolean not null default false;

alter table public.game_challenges
  add column if not exists challenger_forfeited boolean not null default false,
  add column if not exists challenged_forfeited boolean not null default false;

comment on column public.challenge_runs.forfeited is
  'La corrida terminó por agotar el tiempo o por no responder todas las preguntas.';

create or replace function public._resolve_duel(p_challenge_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  r_ch public.challenge_runs%rowtype;
  r_cd public.challenge_runs%rowtype;
  v_found_ch boolean;
  v_found_cd boolean;
  v_winner uuid;
begin
  select * into r_ch
  from public.challenge_runs
  where challenge_id = p_challenge_id and role = 'challenger';
  v_found_ch := found;

  select * into r_cd
  from public.challenge_runs
  where challenge_id = p_challenge_id and role = 'challenged';
  v_found_cd := found;

  if not (v_found_ch and v_found_cd) then return; end if;

  if r_ch.forfeited and r_cd.forfeited then
    v_winner := null;
  elsif r_ch.forfeited then
    v_winner := r_cd.user_id;
  elsif r_cd.forfeited then
    v_winner := r_ch.user_id;
  elsif r_ch.correct_count <> r_cd.correct_count then
    v_winner := case when r_ch.correct_count > r_cd.correct_count then r_ch.user_id else r_cd.user_id end;
  elsif r_ch.score <> r_cd.score then
    v_winner := case when r_ch.score > r_cd.score then r_ch.user_id else r_cd.user_id end;
  elsif r_ch.total_time_ms <> r_cd.total_time_ms then
    v_winner := case when r_ch.total_time_ms < r_cd.total_time_ms then r_ch.user_id else r_cd.user_id end;
  else
    v_winner := null;
  end if;

  update public.game_challenges
  set status = 'completed', winner_id = v_winner, completed_at = now()
  where id = p_challenge_id and status <> 'completed';
end;
$$;

create or replace function public.submit_duel_run(p_challenge_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_c public.game_challenges%rowtype;
  v_role text;
  v_score integer := 0;
  v_time bigint := 0;
  v_correct integer := 0;
  v_answered integer := 0;
  v_rec jsonb := '[]'::jsonb;
  v_seen uuid[] := '{}'::uuid[];
  v_forfeited boolean := false;
  a jsonb;
  v_q public.game_questions%rowtype;
  v_qid uuid;
  v_sel text;
  v_ok boolean;
  v_round_ms bigint;
  v_pq_ms bigint;
  v_both boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_c
  from public.game_challenges
  where id = p_challenge_id
  for update;

  if not found then raise exception 'NOT_FOUND'; end if;
  if v_c.expires_at is not null and v_c.expires_at < now() and v_c.status <> 'completed' then
    update public.game_challenges set status = 'expired' where id = p_challenge_id;
    raise exception 'EXPIRED';
  end if;

  if v_uid = v_c.challenger_id then
    v_role := 'challenger';
    if v_c.status <> 'draft' then raise exception 'INVALID_STATE'; end if;
  else
    v_role := 'challenged';
    if v_c.status not in ('awaiting_opponent', 'in_progress') then raise exception 'INVALID_STATE'; end if;
    if v_c.challenged_id is null then
      update public.game_challenges set challenged_id = v_uid where id = p_challenge_id;
    elsif v_c.challenged_id <> v_uid then
      raise exception 'NOT_A_PARTICIPANT';
    end if;
  end if;

  if exists (
    select 1 from public.challenge_runs
    where challenge_id = p_challenge_id and user_id = v_uid
  ) then
    return jsonb_build_object('status', 'already_submitted');
  end if;

  v_round_ms := coalesce((v_c.ruleset->>'round_seconds')::integer, 180) * 1000;
  v_pq_ms := coalesce((v_c.ruleset->>'per_question_seconds')::integer, 25) * 1000;

  for a in select * from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb))
  loop
    begin
      v_qid := (a->>'question_id')::uuid;
    exception when invalid_text_representation then
      continue;
    end;

    if v_qid is null or not (v_qid = any(v_c.question_ids)) or v_qid = any(v_seen) then
      continue;
    end if;
    v_seen := array_append(v_seen, v_qid);

    select * into v_q from public.game_questions where id = v_qid;
    if not found then continue; end if;

    v_sel := a->>'selected';
    v_ok := v_sel is not null and (v_q.correct_answer #>> '{}') = v_sel;
    v_answered := v_answered + 1;
    v_time := v_time + least(greatest(coalesce((a->>'time_ms')::bigint, 0), 0), v_pq_ms);
    v_forfeited := v_forfeited or v_sel is null or coalesce((a->>'forfeited')::boolean, false);

    if v_ok then
      v_correct := v_correct + 1;
      v_score := v_score + coalesce(v_q.points_reward, 0);
    end if;

    v_rec := v_rec || jsonb_build_object(
      'question_id', v_qid,
      'selected', v_sel,
      'is_correct', v_ok,
      'forfeited', coalesce((a->>'forfeited')::boolean, false)
    );
  end loop;

  v_forfeited := v_forfeited or v_answered < coalesce(array_length(v_c.question_ids, 1), 0);
  v_time := least(v_time, v_round_ms);

  insert into public.challenge_runs (
    challenge_id, user_id, role, score, total_time_ms,
    correct_count, answered_count, answers, forfeited
  ) values (
    p_challenge_id, v_uid, v_role, v_score, v_time,
    v_correct, v_answered, v_rec, v_forfeited
  );

  if v_role = 'challenger' then
    update public.game_challenges
    set challenger_score = v_score,
        challenger_time_ms = v_time,
        challenger_correct = v_correct,
        challenger_forfeited = v_forfeited,
        status = 'awaiting_opponent'
    where id = p_challenge_id;
  else
    update public.game_challenges
    set challenged_score = v_score,
        challenged_time_ms = v_time,
        challenged_correct = v_correct,
        challenged_forfeited = v_forfeited
    where id = p_challenge_id;
  end if;

  select count(*) = 2 into v_both
  from public.challenge_runs
  where challenge_id = p_challenge_id;

  if v_both then perform public._resolve_duel(p_challenge_id); end if;

  return jsonb_build_object(
    'status', 'ok', 'role', v_role, 'correct', v_correct,
    'score', v_score, 'answered', v_answered, 'time_ms', v_time,
    'forfeited', v_forfeited, 'resolved', v_both
  );
end;
$$;

revoke all on function public.submit_duel_run(uuid, jsonb) from public, anon;
grant execute on function public.submit_duel_run(uuid, jsonb) to authenticated;
revoke all on function public._resolve_duel(uuid) from public, anon, authenticated;
