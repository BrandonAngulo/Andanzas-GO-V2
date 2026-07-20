-- Modificadores controlados (puente a temporadas). ADITIVO.
-- Un modificador es una regla temporal que cambia cómo se juega, sin rediseñar el juego
-- (estilo Clash Royale: "semana de muerte súbita", "doble puntaje"...). "Controlado" = uno
-- a la vez, encendido por admin, con ventana clara, versionado por partida y reversible.
-- El admin elige CUÁL versión activar de un catálogo (game_modifiers).

create table if not exists public.game_modifiers (
  key text primary key,
  label text not null,
  description text not null default '',
  config jsonb not null default '{}'::jsonb,  -- {force_mechanic?, score_multiplier?, time_scale?}
  is_active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  order_index int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.game_modifiers enable row level security;
drop policy if exists "modifiers readable" on public.game_modifiers;
create policy "modifiers readable" on public.game_modifiers for select using (true);
grant select on public.game_modifiers to authenticated;

-- Catálogo: las distintas versiones de la mejora que el admin puede activar.
insert into public.game_modifiers (key, label, description, config, order_index) values
  ('sudden_death', 'Muerte súbita', 'Un solo error y se acaba la partida.', '{"force_mechanic":"sudden_death"}'::jsonb, 1),
  ('double_score', 'Doble puntaje', 'Cada acierto vale el doble esta semana.', '{"score_multiplier":2}'::jsonb, 2),
  ('half_time',    'Reloj exprés', 'La mitad de tiempo por pregunta. ¡Pensá rápido!', '{"time_scale":0.5}'::jsonb, 3),
  ('lightning',    'Relámpago', 'Doble puntaje… pero mitad de tiempo.', '{"score_multiplier":2,"time_scale":0.5}'::jsonb, 4)
on conflict (key) do nothing;

-- Versionado por partida: cada sesión recuerda bajo qué modificador se jugó.
alter table public.game_sessions add column if not exists modifier_key text;

-- Modificador activo (dentro de su ventana). Lo leen el motor y la entrada del juego.
create or replace function public.get_active_modifier()
returns jsonb language sql stable security definer set search_path = public as $$
  select case when m.key is null then null else jsonb_build_object(
      'key', m.key, 'label', m.label, 'description', m.description,
      'config', m.config, 'ends_at', m.ends_at) end
  from (
    select * from public.game_modifiers
    where is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at > now())
    order by updated_at desc limit 1
  ) m;
$$;

-- Admin: activa UNA versión (desactiva las demás) con una ventana opcional.
create or replace function public.set_active_modifier(p_key text, p_starts_at timestamptz default null, p_ends_at timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()
                 and (role::text in ('admin','editor') or email = 'gruesobrandon@gmail.com')) then
    raise exception 'NOT_AUTHORIZED';
  end if;
  if not exists (select 1 from public.game_modifiers where key = p_key) then raise exception 'UNKNOWN_MODIFIER'; end if;
  update public.game_modifiers set is_active = false, updated_at = now() where is_active and key <> p_key;
  update public.game_modifiers set is_active = true, starts_at = p_starts_at, ends_at = p_ends_at, updated_at = now() where key = p_key;
  return public.get_active_modifier();
end $$;

-- Admin: apaga cualquier modificador (vuelve a reglas normales).
create or replace function public.clear_active_modifier()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()
                 and (role::text in ('admin','editor') or email = 'gruesobrandon@gmail.com')) then
    raise exception 'NOT_AUTHORIZED';
  end if;
  update public.game_modifiers set is_active = false, updated_at = now() where is_active;
  return jsonb_build_object('cleared', true);
end $$;

grant execute on function public.get_active_modifier() to authenticated;
grant execute on function public.set_active_modifier(text, timestamptz, timestamptz) to authenticated;
grant execute on function public.clear_active_modifier() to authenticated;
