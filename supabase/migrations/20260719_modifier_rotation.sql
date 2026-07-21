-- Rotación automática de modificadores. ADITIVO.
-- Una regla que hace que TODOS los modificadores se turnen solos, cada uno por `period_days`,
-- en bucle y sin cruzarse (siempre uno a la vez). Es DETERMINÍSTICO (sin cron): el modificador
-- activo se calcula según el tiempo transcurrido desde `started_at` y el período. Con la rotación
-- encendida, `get_active_modifier` ignora el flag manual `is_active` y devuelve el del turno.

create table if not exists public.game_modifier_rotation (
  id int primary key default 1,
  enabled boolean not null default false,
  period_days int not null default 7,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.game_modifier_rotation (id) values (1) on conflict (id) do nothing;

alter table public.game_modifier_rotation enable row level security;
drop policy if exists "rotation readable" on public.game_modifier_rotation;
create policy "rotation readable" on public.game_modifier_rotation for select using (true);
grant select on public.game_modifier_rotation to authenticated;

-- Modificador activo: si la rotación está encendida, se calcula el turno; si no, flag manual.
create or replace function public.get_active_modifier()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_rot public.game_modifier_rotation%rowtype;
  v_n int; v_period_secs bigint; v_elapsed bigint; v_slot int;
  m public.game_modifiers%rowtype; v_ends timestamptz; v_cycle bigint;
begin
  select * into v_rot from public.game_modifier_rotation where id = 1;

  if v_rot.enabled then
    select count(*) into v_n from public.game_modifiers;
    if v_n = 0 then return null; end if;
    v_period_secs := greatest(coalesce(v_rot.period_days, 7), 1)::bigint * 86400;
    v_cycle := floor(extract(epoch from (now() - v_rot.started_at)) / v_period_secs)::bigint;
    v_slot := ((v_cycle % v_n) + v_n) % v_n;  -- siempre 0..n-1
    select * into m from public.game_modifiers order by order_index, key offset v_slot limit 1;
    v_ends := v_rot.started_at + make_interval(secs => (v_cycle + 1) * v_period_secs);
    return jsonb_build_object('key', m.key, 'label', m.label, 'description', m.description,
      'config', m.config, 'ends_at', v_ends, 'auto', true);
  end if;

  return (
    select case when x.key is null then null else jsonb_build_object(
        'key', x.key, 'label', x.label, 'description', x.description,
        'config', x.config, 'ends_at', x.ends_at, 'auto', false) end
    from (
      select * from public.game_modifiers
      where is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())
      order by updated_at desc limit 1
    ) x
  );
end $$;

-- Admin: enciende/apaga la rotación y fija el período. Al encender desde apagado, re-ancla a ahora.
create or replace function public.set_modifier_rotation(p_enabled boolean, p_period_days int default null)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()
                 and (role::text in ('admin','editor') or email = 'gruesobrandon@gmail.com')) then
    raise exception 'NOT_AUTHORIZED';
  end if;
  update public.game_modifier_rotation set
    enabled = p_enabled,
    period_days = greatest(coalesce(p_period_days, period_days), 1),
    started_at = case when p_enabled and not enabled then now() else started_at end,
    updated_at = now()
  where id = 1;
  return public.get_active_modifier();
end $$;

grant execute on function public.get_active_modifier() to authenticated;
grant execute on function public.set_modifier_rotation(boolean, int) to authenticated;
