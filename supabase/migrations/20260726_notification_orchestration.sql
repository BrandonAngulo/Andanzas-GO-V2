-- Orquestación de notificaciones personales.
-- Mantiene una sola entrega por contenido/revisión, distingue lectura de consulta
-- y reutiliza la bandeja existente para recordatorios de baja frecuencia.

alter table public.notifications
  add column if not exists consultada_at timestamptz,
  add column if not exists target_type text,
  add column if not exists target_id text,
  add column if not exists payload jsonb not null default '{}'::jsonb;

create index if not exists notifications_user_unread_fecha_idx
  on public.notifications (user_id, leida, fecha desc);

create or replace function public.get_word_of_the_day()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with ranked as (
    select e.id,
           row_number() over (order by e.id) as position,
           count(*) over () as total
    from public.dictionary_entries e
    where e.status = 'published'
  ),
  selected as (
    select r.id
    from ranked r
    where r.position = mod(
      ((now() at time zone 'America/Bogota')::date - date '1970-01-01')::bigint,
      r.total
    ) + 1
  )
  select coalesce(
    (select to_jsonb(e) from public.dictionary_entries e join selected s on s.id = e.id),
    'null'::jsonb
  );
$$;

revoke all on function public.get_word_of_the_day() from public;
grant execute on function public.get_word_of_the_day() to authenticated;

create or replace function public.create_user_notification(
  p_titulo text,
  p_descripcion text,
  p_titulo_en text default null,
  p_descripcion_en text default null,
  p_icono_name text default 'Bell',
  p_tipo text default null,
  p_dedupe_key text default null,
  p_target_type text default null,
  p_target_id text default null,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if nullif(btrim(p_titulo), '') is null or nullif(btrim(p_descripcion), '') is null then
    raise exception 'INVALID_NOTIFICATION';
  end if;

  insert into public.notifications as n (
    user_id, titulo, titulo_en, descripcion, descripcion_en, icono_name,
    tipo, dedupe_key, target_type, target_id, payload, leida, fecha
  )
  values (
    v_uid, btrim(p_titulo), nullif(btrim(p_titulo_en), ''),
    btrim(p_descripcion), nullif(btrim(p_descripcion_en), ''),
    coalesce(nullif(btrim(p_icono_name), ''), 'Bell'),
    nullif(btrim(p_tipo), ''), nullif(btrim(p_dedupe_key), ''),
    nullif(btrim(p_target_type), ''), nullif(btrim(p_target_id), ''),
    coalesce(p_payload, '{}'::jsonb), false, now()
  )
  on conflict (user_id, dedupe_key) where dedupe_key is not null
  do update set
    titulo = excluded.titulo,
    titulo_en = excluded.titulo_en,
    descripcion = excluded.descripcion,
    descripcion_en = excluded.descripcion_en,
    icono_name = excluded.icono_name,
    tipo = excluded.tipo,
    target_type = excluded.target_type,
    target_id = excluded.target_id,
    payload = excluded.payload
  returning to_jsonb(n) into v_result;

  return v_result;
end;
$$;

revoke all on function public.create_user_notification(text,text,text,text,text,text,text,text,text,jsonb) from public;
grant execute on function public.create_user_notification(text,text,text,text,text,text,text,text,text,jsonb) to authenticated;

create or replace function public.ensure_daily_notification()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_key text := 'daily:' || v_day::text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if exists (
    select 1 from public.daily_question_attempts a
    where a.user_id = v_uid and a.day = v_day
  ) then
    return jsonb_build_object('created', false, 'reason', 'answered');
  end if;

  insert into public.notifications (
    user_id, titulo, titulo_en, descripcion, descripcion_en, icono_name,
    tipo, dedupe_key, target_type
  )
  values (
    v_uid,
    'Pregunta del día disponible 🔥',
    'Daily question available 🔥',
    'Respondé la de hoy, sumá monedas y mantené viva tu racha.',
    'Answer today''s question, earn coins and keep your streak alive.',
    'Calendar', 'daily_question', v_key, 'daily_question'
  )
  on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;

  return case when found
    then jsonb_build_object('created', true)
    else jsonb_build_object('created', false, 'reason', 'exists')
  end;
end;
$$;

create or replace function public.ensure_app_notifications()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_week date := date_trunc('week', (now() at time zone 'America/Bogota'))::date;
  v_created int := 0;
  v_resurfaced int := 0;
  v_rows int := 0;
  v_daily jsonb;
  v_word jsonb;
  v_key text;
  v_target_type text;
  v_target_id text;
  item record;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  v_daily := public.ensure_daily_notification();
  if coalesce((v_daily->>'created')::boolean, false) then v_created := v_created + 1; end if;

  -- Palabra del día: se omite cuando ya fue descubierta hoy.
  if not exists (
    select 1 from public.user_word_of_day w
    where w.user_id = v_uid and w.last_claim_date = v_day
  ) then
    v_word := public.get_word_of_the_day();
    if v_word is not null and v_word <> 'null'::jsonb then
      insert into public.notifications (
        user_id, titulo, titulo_en, descripcion, descripcion_en, icono_name,
        tipo, dedupe_key, target_type, target_id, payload
      )
      values (
        v_uid,
        'La palabra del día es “' || (v_word->>'term') || '”',
        'Today''s word is “' || (v_word->>'term') || '”',
        'Descubrí qué significa, sumá puntos y mantené tu racha.',
        'Discover what it means, earn points and keep your streak.',
        'BookOpen', 'word_of_day', 'word:' || v_day::text,
        'dictionary', v_word->>'id', jsonb_build_object('entry_id', v_word->>'id')
      )
      on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
      get diagnostics v_rows = row_count;
      v_created := v_created + v_rows;
    end if;
  end if;

  -- Imperdibles: una entrega por revisión. Si se marcó como leída sin abrirla,
  -- la misma entrega reaparece una sola vez cada siete días.
  for item in
    select b.* from public.promoted_banners b
    where b.is_active
    order by b.order_index, b.updated_at desc
  loop
    v_key := 'featured:' || item.id::text || ':' || md5(item.updated_at::text);
    insert into public.notifications (
      user_id, titulo, descripcion, icono_name, tipo, dedupe_key,
      target_type, target_id, payload
    )
    values (
      v_uid,
      coalesce(nullif(item.tag, ''), 'Nuevo imperdible') || ': ' || item.title,
      coalesce(nullif(item.subtitle, ''), 'Hay una nueva experiencia esperando por vos.'),
      'Sparkles', 'featured', v_key, item.target_type, item.target_id,
      jsonb_build_object('banner_id', item.id)
    )
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
    get diagnostics v_rows = row_count;
    v_created := v_created + v_rows;

    if v_rows = 0 then
      update public.notifications n
      set leida = false, fecha = now()
      where n.user_id = v_uid
        and n.dedupe_key = v_key
        and n.leida
        and n.consultada_at is null
        and n.fecha < now() - interval '7 days';
      get diagnostics v_rows = row_count;
      v_resurfaced := v_resurfaced + v_rows;
    end if;
  end loop;

  -- Curiosidades: solo las que el equipo editorial marcó expresamente.
  for item in
    select f.* from public.curious_facts f
    where f.status = 'published'
      and f.show_as_notification
      and (f.publish_at is null or f.publish_at <= now())
    order by coalesce(f.published_at, f.updated_at) desc
  loop
    v_target_type := case
      when item.related_entry_id is not null then 'learn'
      when item.related_route_id is not null then 'route'
      when item.related_game_id is not null then 'game'
      else 'learn'
    end;
    v_target_id := coalesce(item.related_entry_id::text, item.related_route_id, item.related_game_id::text);
    v_key := 'curious-fact:' || item.id::text || ':' || md5(item.updated_at::text);

    insert into public.notifications (
      user_id, titulo, descripcion, icono_name, tipo, dedupe_key,
      target_type, target_id, payload
    )
    values (
      v_uid,
      coalesce(nullif(item.notification_title, ''), nullif(item.title, ''), 'Pa'' que sepás'),
      coalesce(nullif(item.notification_body, ''), item.text),
      'Lightbulb', 'curious_fact', v_key, v_target_type, v_target_id,
      jsonb_build_object('fact_id', item.id)
    )
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
    get diagnostics v_rows = row_count;
    v_created := v_created + v_rows;
  end loop;

  -- Metas listas para reclamar: una alerta por meta y semana.
  for item in
    select g.* from public._weekly_goals_progress(v_uid, v_week) g
    where g.progress >= g.target
      and not exists (
        select 1 from public.weekly_goal_claims c
        where c.user_id = v_uid and c.week_start = v_week and c.goal_key = g.goal_key
      )
  loop
    insert into public.notifications (
      user_id, titulo, titulo_en, descripcion, descripcion_en, icono_name,
      tipo, dedupe_key, target_type, target_id
    )
    values (
      v_uid,
      '¡Meta semanal cumplida!',
      'Weekly goal completed!',
      item.title || ': reclamá tus ' || item.reward_coins || ' monedas.',
      item.title || ': claim your ' || item.reward_coins || ' coins.',
      'Trophy', 'weekly_goal', 'weekly:' || v_week::text || ':' || item.goal_key,
      'weekly_goals', item.goal_key
    )
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
    get diagnostics v_rows = row_count;
    v_created := v_created + v_rows;
  end loop;

  -- Rutas pausadas: primer recordatorio a los tres días; luego, como máximo, semanal.
  for item in
    select p.route_id, p.updated_at, r.nombre, r.nombre_en
    from public.user_route_progress p
    join public.routes r on r.id = p.route_id
    where p.user_id = v_uid
      and p.status = 'in_progress'
      and p.updated_at < now() - interval '3 days'
  loop
    v_key := 'route-reminder:' || item.route_id;
    insert into public.notifications (
      user_id, titulo, titulo_en, descripcion, descripcion_en, icono_name,
      tipo, dedupe_key, target_type, target_id
    )
    values (
      v_uid,
      'Tu andanza sigue esperando',
      'Your journey is waiting',
      'Retomá “' || item.nombre || '” desde la parada donde quedaste.',
      'Resume “' || coalesce(item.nombre_en, item.nombre) || '” where you left off.',
      'Route', 'route_reminder', v_key, 'route', item.route_id
    )
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
    get diagnostics v_rows = row_count;
    v_created := v_created + v_rows;

    if v_rows = 0 then
      update public.notifications n
      set leida = false, consultada_at = null, fecha = now()
      where n.user_id = v_uid
        and n.dedupe_key = v_key
        and n.leida
        and n.fecha < now() - interval '7 days';
      get diagnostics v_rows = row_count;
      v_resurfaced := v_resurfaced + v_rows;
    end if;
  end loop;

  return jsonb_build_object('created', v_created, 'resurfaced', v_resurfaced);
end;
$$;

revoke all on function public.ensure_app_notifications() from public;
grant execute on function public.ensure_app_notifications() to authenticated;

-- La promoción desde lista de espera es un hecho importante y se notifica en el
-- mismo movimiento transaccional que libera el cupo.
create or replace function public.cancel_route_registration(p_route_id text, p_user_id uuid default null)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  target_user uuid := coalesce(p_user_id, auth.uid());
  previous_status text;
  promoted_id uuid;
  promoted_user uuid;
  route_name text;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if target_user is distinct from uid and not public.is_staff() then raise exception 'Forbidden'; end if;

  perform 1 from public.routes r where r.id = p_route_id for update;
  select rr.status into previous_status
  from public.route_registrations rr
  where rr.route_id = p_route_id and rr.user_id = target_user
  for update;
  if previous_status is null or previous_status = 'cancelled' then return false; end if;

  update public.route_registrations
  set status = 'cancelled', cancelled_at = now(), updated_at = now()
  where route_id = p_route_id and user_id = target_user;

  if previous_status = 'confirmed' then
    select rr.id, rr.user_id into promoted_id, promoted_user
    from public.route_registrations rr
    where rr.route_id = p_route_id and rr.status = 'waitlist'
    order by rr.created_at
    for update skip locked
    limit 1;

    if promoted_id is not null then
      update public.route_registrations
      set status = 'confirmed', updated_at = now()
      where id = promoted_id;

      select r.nombre into route_name from public.routes r where r.id = p_route_id;
      insert into public.notifications (
        user_id, titulo, descripcion, icono_name, tipo, dedupe_key,
        target_type, target_id
      )
      values (
        promoted_user,
        '¡Se liberó un cupo para vos!',
        'Tu inscripción a “' || coalesce(route_name, 'la ruta') || '” quedó confirmada.',
        'Calendar', 'route_registration_confirmed',
        'route-registration:' || promoted_id::text || ':confirmed',
        'route', p_route_id
      )
      on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
    end if;
  end if;

  update public.routes r
  set current_registrations = (
    select count(*) from public.route_registrations rr
    where rr.route_id = p_route_id and rr.status = 'confirmed'
  )
  where r.id = p_route_id;
  return true;
end;
$$;

