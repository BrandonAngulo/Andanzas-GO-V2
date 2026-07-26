-- Unifica el dato del día que aparece en Explorar con su notificación.
-- La rotación usa la fecha de Bogotá y recorre el contenido publicado antes
-- de repetirlo.

create or replace function public.get_daily_curious_fact()
returns setof public.curious_facts
language sql
stable
security invoker
set search_path = ''
as $$
  with ranked as (
    select
      f.id,
      row_number() over (
        order by coalesce(f.published_at, f.updated_at) desc, f.id
      ) as position,
      count(*) over () as total
    from public.curious_facts f
    where f.status = 'published'
      and f.show_in_home
      and (f.publish_at is null or f.publish_at <= now())
  )
  select f.*
  from ranked r
  join public.curious_facts f on f.id = r.id
  where r.position = (
    mod(
      (
        (now() at time zone 'America/Bogota')::date
        - date '2026-01-01'
      ),
      r.total::integer
    ) + 1
  )
  limit 1;
$$;

revoke all on function public.get_daily_curious_fact() from public;
grant execute on function public.get_daily_curious_fact() to anon, authenticated;

create or replace function public.ensure_daily_curiosity_notification()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_fact public.curious_facts%rowtype;
  v_key text;
  v_target_type text;
  v_target_id text;
  v_rows integer := 0;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_fact
  from public.get_daily_curious_fact()
  limit 1;

  if v_fact.id is null then
    return jsonb_build_object('created', 0);
  end if;

  v_target_type := case
    when v_fact.related_entry_id is not null then 'learn'
    when v_fact.related_route_id is not null then 'route'
    when v_fact.related_game_id is not null then 'game'
    else 'explore'
  end;
  v_target_id := coalesce(
    v_fact.related_entry_id::text,
    v_fact.related_route_id,
    v_fact.related_game_id::text,
    v_fact.id::text
  );

  -- Comparte la clave con los avisos editoriales de curiosidades. Así una
  -- misma revisión del contenido nunca genera dos notificaciones.
  v_key := 'curious-fact:' || v_fact.id::text || ':' || md5(v_fact.updated_at::text);

  insert into public.notifications (
    user_id,
    titulo,
    descripcion,
    icono_name,
    tipo,
    dedupe_key,
    target_type,
    target_id,
    payload
  )
  values (
    v_uid,
    'Dato del día: ' || coalesce(nullif(v_fact.title, ''), 'Pa'' que sepás'),
    coalesce(nullif(v_fact.notification_body, ''), v_fact.text),
    'Lightbulb',
    'daily_fact',
    v_key,
    v_target_type,
    v_target_id,
    jsonb_build_object('fact_id', v_fact.id, 'daily', true)
  )
  on conflict (user_id, dedupe_key)
    where dedupe_key is not null
    do nothing;

  get diagnostics v_rows = row_count;
  return jsonb_build_object('created', v_rows, 'fact_id', v_fact.id);
end;
$$;

revoke all on function public.ensure_daily_curiosity_notification() from public;
grant execute on function public.ensure_daily_curiosity_notification() to authenticated;
