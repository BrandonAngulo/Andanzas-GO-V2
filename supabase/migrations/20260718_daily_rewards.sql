-- Fase 2 — Recompensas de la Pregunta del día. ADITIVO (create or replace).
-- Base 10 monedas por participar. Racha ESTRICTA consecutiva (miss => reset a 1; se quita la
-- gracia de 1 día). Multiplicador diario: x2 la semana 1, +0.5 por semana (x2.5, x3...).
-- Al completar 7 días: bonus = (suma de monedas de esos 7 días) x (factor-1), factor 1.5 el
-- primer bloque y +0.5 por bloque (dia14 x2, dia21 x2.5...). Cada 14 días: +1 gema. Dia 30: +3 gemas.
-- Todo se acredita por el ledger economy.apply_rewards con clave idempotente por día.

-- Valor en monedas del día D de racha (determinista).
create or replace function public._daily_coin_value(d int)
returns int language sql immutable as $$
  select case
    when d <= 0 then 0
    when d = 1 then 10
    else round(10 * (1.5 + 0.5 * ceil(d::numeric / 7)))::int
  end;
$$;

create or replace function public.answer_daily_question(p_selected text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_qid uuid; v_q public.game_questions%rowtype; v_ok boolean;
  v_state public.user_daily_state%rowtype; v_new int; v_best int;
  v_daily int; v_weekly int := 0; v_coins int; v_gems int := 0;
  v_block int; v_factor numeric; v_s int;
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

  -- Racha ESTRICTA consecutiva.
  select * into v_state from public.user_daily_state where user_id = v_uid;
  if found and v_state.last_day = v_day - 1 then
    v_new := coalesce(v_state.current_streak, 0) + 1;
  else
    v_new := 1;
  end if;
  v_best := greatest(coalesce(v_state.best_streak, 0), v_new);
  insert into public.user_daily_state (user_id, current_streak, best_streak, last_day)
  values (v_uid, v_new, v_best, v_day)
  on conflict (user_id) do update set current_streak = v_new, best_streak = v_best, last_day = v_day;

  -- Recompensa.
  v_daily := public._daily_coin_value(v_new);
  v_coins := v_daily;
  if v_new % 7 = 0 then
    v_block := v_new / 7;
    v_factor := 1 + 0.5 * v_block;                     -- 1.5, 2.0, 2.5...
    select coalesce(sum(public._daily_coin_value(g)), 0) into v_s from generate_series(v_new - 6, v_new) g;
    v_weekly := round(v_s * (v_factor - 1))::int;
    v_coins := v_coins + v_weekly;
  end if;
  if v_new % 14 = 0 then v_gems := v_gems + 1; end if;  -- cada dos semanas
  if v_new = 30 then v_gems := v_gems + 3; end if;      -- 30 días continuos

  perform economy.apply_rewards(
    v_uid, 0::bigint, 0::bigint, v_coins::bigint, v_gems::bigint,
    'daily_question', 'daily', v_day::text, 'daily:' || v_uid::text || ':' || v_day::text,
    jsonb_build_object('streak', v_new, 'is_correct', v_ok, 'daily_coins', v_daily, 'weekly_bonus', v_weekly)
  );

  return jsonb_build_object('is_correct', v_ok, 'correct_answer', v_q.correct_answer,
    'explanation', v_q.explanation, 'streak', v_new, 'best_streak', v_best,
    'reward', jsonb_build_object('coins', v_coins, 'gems', v_gems, 'daily_coins', v_daily, 'weekly_bonus', v_weekly));
end $$;

grant execute on function public.answer_daily_question(text) to authenticated;
grant execute on function public._daily_coin_value(int) to authenticated;
