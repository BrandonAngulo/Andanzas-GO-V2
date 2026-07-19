-- Fase 2 — Protector de racha (coleccionable, estilo Duolingo). ADITIVO.
-- Regla central (spec del producto): el protector debe estar ARMADO cuando ocurre la falta
-- (el día saltado); armarlo después no aplica. Por eso se guarda la FECHA de armado
-- (protector_armed_on) y no solo un booleano: al volver tras un hueco de exactamente 1 día,
-- el protector salva la racha solo si protector_armed_on <= día saltado.
-- v1: cubre exactamente 1 día; al usarse se consume y queda desarmado. Se gana +1 al
-- completar cada semana de racha (tope 2 en reserva). Armar/desarmar es gratis.

alter table public.user_daily_state
  add column if not exists protectors int not null default 0,
  add column if not exists protector_armed_on date;

-- Armar (requiere tener al menos 1) o desarmar el protector.
create or replace function public.set_daily_protector(p_armed boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_state public.user_daily_state%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_state from public.user_daily_state where user_id = v_uid;
  if not found then
    insert into public.user_daily_state (user_id) values (v_uid)
    on conflict (user_id) do nothing;
    select * into v_state from public.user_daily_state where user_id = v_uid;
  end if;
  if p_armed then
    if coalesce(v_state.protectors, 0) < 1 then raise exception 'NO_PROTECTORS'; end if;
    update public.user_daily_state set protector_armed_on = v_day where user_id = v_uid;
  else
    update public.user_daily_state set protector_armed_on = null where user_id = v_uid;
  end if;
  return jsonb_build_object('protectors', coalesce(v_state.protectors,0), 'armed', p_armed);
end $$;

-- get_daily_question: incluye estado del protector.
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
    'day', v_day, 'answered', v_answered,
    'streak', coalesce(v_state.current_streak, 0), 'best_streak', coalesce(v_state.best_streak, 0),
    'protectors', coalesce(v_state.protectors, 0),
    'protector_armed', (v_state.protector_armed_on is not null),
    'question', jsonb_build_object('id', v_q.id, 'question_text', v_q.question_text,
      'question_type', v_q.question_type, 'options', v_q.options, 'category', v_q.category),
    'review', case when v_answered then jsonb_build_object(
        'selected', v_att.selected, 'correct_answer', v_q.correct_answer,
        'is_correct', v_att.is_correct, 'explanation', v_q.explanation) else null end
  );
end $$;

-- answer_daily_question: racha con protector + otorga protector al completar semana.
create or replace function public.answer_daily_question(p_selected text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_qid uuid; v_q public.game_questions%rowtype; v_ok boolean;
  v_state public.user_daily_state%rowtype; v_new int; v_best int;
  v_daily int; v_weekly int := 0; v_coins int; v_gems int := 0;
  v_block int; v_factor numeric; v_s int;
  v_protectors int := 0; v_armed_on date := null;
  v_protector_used boolean := false; v_protector_earned boolean := false;
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

  -- Racha estricta + protector (cubre exactamente 1 día saltado, armado ANTES de la falta).
  select * into v_state from public.user_daily_state where user_id = v_uid;
  if found then
    v_protectors := coalesce(v_state.protectors, 0);
    v_armed_on := v_state.protector_armed_on;
  end if;

  if v_state.last_day = v_day - 1 then
    v_new := coalesce(v_state.current_streak, 0) + 1;
  elsif v_state.last_day = v_day - 2
        and v_protectors > 0
        and v_armed_on is not null and v_armed_on <= v_day - 1 then
    -- El día saltado fue v_day-1 y el protector estaba armado desde antes (o durante) esa falta.
    v_new := coalesce(v_state.current_streak, 0) + 1;
    v_protectors := v_protectors - 1;
    v_armed_on := null; -- se consume y queda desarmado
    v_protector_used := true;
  else
    v_new := 1;
  end if;
  v_best := greatest(coalesce(v_state.best_streak, 0), v_new);

  -- Al completar una semana de racha, además del bonus, gana 1 protector (tope 2).
  if v_new % 7 = 0 and v_protectors < 2 then
    v_protectors := v_protectors + 1;
    v_protector_earned := true;
  end if;

  insert into public.user_daily_state (user_id, current_streak, best_streak, last_day, protectors, protector_armed_on)
  values (v_uid, v_new, v_best, v_day, v_protectors, v_armed_on)
  on conflict (user_id) do update
    set current_streak = v_new, best_streak = v_best, last_day = v_day,
        protectors = v_protectors, protector_armed_on = v_armed_on;

  -- Recompensa (igual que antes).
  v_daily := public._daily_coin_value(v_new);
  v_coins := v_daily;
  if v_new % 7 = 0 then
    v_block := v_new / 7;
    v_factor := 1 + 0.5 * v_block;
    select coalesce(sum(public._daily_coin_value(g)), 0) into v_s from generate_series(v_new - 6, v_new) g;
    v_weekly := round(v_s * (v_factor - 1))::int;
    v_coins := v_coins + v_weekly;
  end if;
  if v_new % 14 = 0 then v_gems := v_gems + 1; end if;
  if v_new = 30 then v_gems := v_gems + 3; end if;

  perform economy.apply_rewards(
    v_uid, 0::bigint, 0::bigint, v_coins::bigint, v_gems::bigint,
    'daily_question', 'daily', v_day::text, 'daily:' || v_uid::text || ':' || v_day::text,
    jsonb_build_object('streak', v_new, 'is_correct', v_ok, 'daily_coins', v_daily,
                       'weekly_bonus', v_weekly, 'protector_used', v_protector_used)
  );

  return jsonb_build_object('is_correct', v_ok, 'correct_answer', v_q.correct_answer,
    'explanation', v_q.explanation, 'streak', v_new, 'best_streak', v_best,
    'protector_used', v_protector_used, 'protector_earned', v_protector_earned,
    'protectors', v_protectors,
    'reward', jsonb_build_object('coins', v_coins, 'gems', v_gems, 'daily_coins', v_daily, 'weekly_bonus', v_weekly));
end $$;

grant execute on function public.set_daily_protector(boolean) to authenticated;
grant execute on function public.get_daily_question() to authenticated;
grant execute on function public.answer_daily_question(text) to authenticated;
