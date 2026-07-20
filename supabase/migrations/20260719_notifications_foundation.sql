-- Cimiento de notificaciones + primera notificación útil (Pregunta del día). ADITIVO.
-- Hallazgo: el cliente (services/notifications.service.ts, UserDataContext, NotificationsPanel)
-- lee/escribe la tabla `notifications` y llama al RPC `broadcast_notification`, pero NINGUNO
-- existía en la BD (mismo patrón que el bug de banners: fallaba en silencio). Se crean aquí.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  titulo text not null,
  titulo_en text,
  descripcion text not null default '',
  descripcion_en text,
  icono_name text not null default 'Compass',
  tipo text,          -- enrutamiento del clic en el cliente: 'daily_question' | 'badge_earned' | 'broadcast' | ...
  dedupe_key text,    -- anti-duplicado por usuario (p.ej. 'daily:2026-07-19')
  leida boolean not null default false,
  fecha timestamptz not null default now()
);
create index if not exists idx_notifications_user_fecha on public.notifications(user_id, fecha desc);
create unique index if not exists uq_notifications_dedupe on public.notifications(user_id, dedupe_key) where dedupe_key is not null;

alter table public.notifications enable row level security;
drop policy if exists "own notifications select" on public.notifications;
create policy "own notifications select" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "own notifications update" on public.notifications;
create policy "own notifications update" on public.notifications for update using (auth.uid() = user_id);
drop policy if exists "own notifications insert" on public.notifications;
create policy "own notifications insert" on public.notifications for insert with check (auth.uid() = user_id);
grant select, insert, update on public.notifications to authenticated;

-- Difusión a todos los usuarios (solo admin; mismo criterio que la política de analytics).
create or replace function public.broadcast_notification(p_titulo text, p_descripcion text, p_icono_name text default 'Megaphone')
returns int language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_count int;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (
    select 1 from public.profiles
    where id = v_uid and (role::text in ('admin','editor') or email = 'gruesobrandon@gmail.com')
  ) then raise exception 'NOT_AUTHORIZED'; end if;

  insert into public.notifications (user_id, titulo, descripcion, icono_name, tipo)
  select p.id, p_titulo, p_descripcion, coalesce(p_icono_name,'Megaphone'), 'broadcast'
  from public.profiles p;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

-- Notificación diaria: si el usuario NO respondió hoy y aún no tiene la de hoy, se crea.
-- Idempotente por (user_id, dedupe_key). Pensada para llamarse al cargar la app.
create or replace function public.ensure_daily_notification()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'America/Bogota')::date;
  v_key text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_key := 'daily:' || v_day::text;
  if exists (select 1 from public.daily_question_attempts a where a.user_id = v_uid and a.day = v_day) then
    return jsonb_build_object('created', false, 'reason', 'answered');
  end if;
  insert into public.notifications (user_id, titulo, titulo_en, descripcion, descripcion_en, icono_name, tipo, dedupe_key)
  values (v_uid,
          'Pregunta del día disponible 🔥',
          'Daily question available 🔥',
          'Respondé la de hoy, sumá monedas y mantené viva tu racha.',
          'Answer today''s question, earn coins and keep your streak alive.',
          'Calendar', 'daily_question', v_key)
  on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
  if found then
    return jsonb_build_object('created', true);
  end if;
  return jsonb_build_object('created', false, 'reason', 'exists');
end $$;

grant execute on function public.broadcast_notification(text, text, text) to authenticated;
grant execute on function public.ensure_daily_notification() to authenticated;
