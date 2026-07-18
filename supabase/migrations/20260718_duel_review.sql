-- Fase 1 — Duelo: review post-partida (explicaciones al final).
-- Durante el duelo el cliente NO recibe la respuesta correcta (anti-trampa). Este RPC, tras
-- que el jugador ya envió su corrida, devuelve por pregunta: su selección, la correcta, si
-- acertó y la explicación. Seguro: ya no puede cambiar respuestas. Solo devuelve la corrida
-- del propio solicitante (participante del reto).

create or replace function public.get_duel_review(p_challenge_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_c public.game_challenges%rowtype;
  v_run public.challenge_runs%rowtype;
  v_review jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_challenges where id = p_challenge_id;
  if not found then raise exception 'NOT_FOUND'; end if;
  if v_uid <> v_c.challenger_id and (v_c.challenged_id is null or v_uid <> v_c.challenged_id) then
    raise exception 'NOT_A_PARTICIPANT';
  end if;
  select * into v_run from public.challenge_runs where challenge_id = p_challenge_id and user_id = v_uid;
  if not found then raise exception 'NO_RUN'; end if;

  select jsonb_agg(
    jsonb_build_object(
      'question_id', q.id,
      'question_text', q.question_text,
      'options', q.options,
      'category', q.category,
      'selected', ans.sel,
      'correct_answer', q.correct_answer,
      'is_correct', coalesce(ans.ok, false),
      'explanation', q.explanation
    ) order by array_position(v_c.question_ids, q.id)
  ) into v_review
  from public.game_questions q
  left join lateral (
    select (a->>'selected') as sel, (a->>'is_correct')::boolean as ok
    from jsonb_array_elements(v_run.answers) a
    where (a->>'question_id')::uuid = q.id
    limit 1
  ) ans on true
  where q.id = any(v_c.question_ids);

  return jsonb_build_object(
    'challenge_id', v_c.id,
    'correct', v_run.correct_count,
    'total', array_length(v_c.question_ids,1),
    'score', v_run.score,
    'time_ms', v_run.total_time_ms,
    'review', coalesce(v_review, '[]'::jsonb)
  );
end $$;

grant execute on function public.get_duel_review(uuid) to authenticated;
