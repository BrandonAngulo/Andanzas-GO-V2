-- Keep the repository schema aligned with the promoted content already used by
-- Explorar, route cards and user route bookmarks.

alter table public.routes
  add column if not exists image_url text;

alter table public.profiles
  add column if not exists saved_routes text[] default '{}'::text[];

create table if not exists public.promoted_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  tag text,
  target_type text check (target_type in ('route', 'event', 'game', 'url')),
  target_id text,
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.promoted_banners enable row level security;

drop policy if exists promoted_banners_read on public.promoted_banners;
create policy promoted_banners_read
  on public.promoted_banners
  for select
  using (true);

drop policy if exists promoted_banners_admin_manage on public.promoted_banners;
drop policy if exists promoted_banners_admin_insert on public.promoted_banners;
create policy promoted_banners_admin_insert
  on public.promoted_banners
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'::app_role
    )
  );

drop policy if exists promoted_banners_admin_update on public.promoted_banners;
create policy promoted_banners_admin_update
  on public.promoted_banners
  for update
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'::app_role
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'::app_role
    )
  );

drop policy if exists promoted_banners_admin_delete on public.promoted_banners;
create policy promoted_banners_admin_delete
  on public.promoted_banners
  for delete
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'::app_role
    )
  );

insert into public.promoted_banners
  (title, subtitle, image_url, tag, target_type, target_id, is_active, order_index)
select
  seed.title,
  seed.subtitle,
  seed.image_url,
  seed.tag,
  seed.target_type,
  seed.target_id,
  true,
  seed.order_index
from (
  values
    ('Ruta Histórica y Colonial', 'Descubre los vestigios del Cali colonial', '/images/imperdibles/banner_ruta_colonial.png', 'Ruta Recomendada', 'route', 'ruta2', 1),
    ('Cartelera Cultural', 'Eventos que no te podés perder esta semana', '/images/imperdibles/banner_evento_cali.png', 'Evento Destacado', 'event', null, 2),
    ('Trivia Cali', '¿Cuánto sabés de tu ciudad? ¡Ponete a prueba!', '/images/imperdibles/banner_juego_trivia.png', 'Juego Interactivo', 'game', '83333333-3333-3333-3333-333333333333', 3)
) as seed(title, subtitle, image_url, tag, target_type, target_id, order_index)
where not exists (
  select 1
  from public.promoted_banners existing
  where existing.image_url = seed.image_url
);
