-- Diccionario de jergas y culturas — Paso 1: jerarquía geográfica.
-- Reencuadra el "Diccionario de la caleñidad" como diccionario multi-región sin perder
-- el contenido existente. Introduce capítulos (país) → agrupadores (departamento/estado)
-- → apartados (ciudad/municipio) mediante una tabla autorreferenciada, y una relación
-- N–N entrada↔región (una jerga puede compartirse entre ciudades/países sin duplicarse).
--
-- Migración ADITIVA y reversible: crea tablas nuevas + semilla Colombia/Valle/Cali +
-- backfill de las entradas actuales. NO altera ni borra datos de dictionary_entries.
-- geographic_scope (text[]) se conserva como campo descriptivo legible en la ficha.

-- 1) Jerarquía geográfica: country > region > city (parent_id autorreferenciado).
create table if not exists public.dictionary_regions (
    id          uuid primary key default gen_random_uuid(),
    parent_id   uuid references public.dictionary_regions(id) on delete cascade,
    level       text not null check (level in ('country','region','city')),
    name        text not null,
    slug        text not null unique,
    emoji_flag  text,
    cover_url   text,
    sort_order  integer not null default 0,
    created_at  timestamptz not null default timezone('utc'::text, now()),
    updated_at  timestamptz not null default timezone('utc'::text, now())
);
comment on table public.dictionary_regions is
    'Jerarquía geográfica del diccionario: capítulo (country) > agrupador (region) > apartado (city). Autorreferenciada vía parent_id.';
create index if not exists dictionary_regions_parent_idx on public.dictionary_regions(parent_id);
create index if not exists dictionary_regions_level_idx  on public.dictionary_regions(level);

-- 2) Relación N–N entrada ↔ región. is_primary marca la región de origen (capítulo natural).
create table if not exists public.dictionary_entry_regions (
    entry_id   uuid not null references public.dictionary_entries(id) on delete cascade,
    region_id  uuid not null references public.dictionary_regions(id) on delete cascade,
    is_primary boolean not null default false,
    scope_note text,
    created_at timestamptz not null default timezone('utc'::text, now()),
    primary key (entry_id, region_id)
);
comment on table public.dictionary_entry_regions is
    'Vincula cada entrada con una o más regiones. is_primary = región de origen; scope_note describe usos compartidos.';
create index if not exists dictionary_entry_regions_region_idx on public.dictionary_entry_regions(region_id);
-- Una sola región primaria por entrada.
create unique index if not exists dictionary_entry_regions_one_primary_idx
    on public.dictionary_entry_regions(entry_id) where is_primary;

-- 3) RLS. Regiones = etiquetas geográficas públicas (como dictionary_tags).
--    entry_regions = legible si la entrada está publicada (como dictionary_entry_tags).
alter table public.dictionary_regions       enable row level security;
alter table public.dictionary_entry_regions enable row level security;

drop policy if exists dictionary_regions_anon_read on public.dictionary_regions;
create policy dictionary_regions_anon_read on public.dictionary_regions
    for select to anon using (true);
drop policy if exists dictionary_regions_authenticated_read on public.dictionary_regions;
create policy dictionary_regions_authenticated_read on public.dictionary_regions
    for select to authenticated using (true);
drop policy if exists dictionary_regions_staff_insert on public.dictionary_regions;
create policy dictionary_regions_staff_insert on public.dictionary_regions
    for insert to authenticated
    with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));
drop policy if exists dictionary_regions_staff_update on public.dictionary_regions;
create policy dictionary_regions_staff_update on public.dictionary_regions
    for update to authenticated
    using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])))
    with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));
drop policy if exists dictionary_regions_staff_delete on public.dictionary_regions;
create policy dictionary_regions_staff_delete on public.dictionary_regions
    for delete to authenticated
    using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));

drop policy if exists dictionary_entry_regions_anon_read on public.dictionary_entry_regions;
create policy dictionary_entry_regions_anon_read on public.dictionary_entry_regions
    for select to anon
    using (exists (select 1 from public.dictionary_entries e
                   where e.id = dictionary_entry_regions.entry_id
                     and e.status = 'published'
                     and (e.publish_at is null or e.publish_at <= timezone('utc'::text, now()))));
drop policy if exists dictionary_entry_regions_authenticated_read on public.dictionary_entry_regions;
create policy dictionary_entry_regions_authenticated_read on public.dictionary_entry_regions
    for select to authenticated
    using (
        exists (select 1 from public.dictionary_entries e
                where e.id = dictionary_entry_regions.entry_id
                  and e.status = 'published'
                  and (e.publish_at is null or e.publish_at <= timezone('utc'::text, now())))
        or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));
drop policy if exists dictionary_entry_regions_staff_insert on public.dictionary_entry_regions;
create policy dictionary_entry_regions_staff_insert on public.dictionary_entry_regions
    for insert to authenticated
    with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));
drop policy if exists dictionary_entry_regions_staff_update on public.dictionary_entry_regions;
create policy dictionary_entry_regions_staff_update on public.dictionary_entry_regions
    for update to authenticated
    using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])))
    with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));
drop policy if exists dictionary_entry_regions_staff_delete on public.dictionary_entry_regions;
create policy dictionary_entry_regions_staff_delete on public.dictionary_entry_regions
    for delete to authenticated
    using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));

-- 4) Semilla del primer capítulo: Colombia › Valle del Cauca › Cali.
insert into public.dictionary_regions (level, name, slug, emoji_flag, sort_order)
values ('country', 'Colombia', 'colombia', '🇨🇴', 0)
on conflict (slug) do nothing;

insert into public.dictionary_regions (parent_id, level, name, slug, sort_order)
select id, 'region', 'Valle del Cauca', 'valle-del-cauca', 0
from public.dictionary_regions where slug = 'colombia'
on conflict (slug) do nothing;

insert into public.dictionary_regions (parent_id, level, name, slug, sort_order)
select id, 'city', 'Cali', 'cali', 0
from public.dictionary_regions where slug = 'valle-del-cauca'
on conflict (slug) do nothing;

-- 5) Backfill: toda entrada existente nace en el capítulo caleño (región primaria = Cali).
insert into public.dictionary_entry_regions (entry_id, region_id, is_primary)
select e.id, r.id, true
from public.dictionary_entries e
cross join (select id from public.dictionary_regions where slug = 'cali') r
on conflict (entry_id, region_id) do nothing;

-- 6) Marcar como compartidas a nivel nacional las que su geographic_scope menciona "Colombia".
insert into public.dictionary_entry_regions (entry_id, region_id, is_primary, scope_note)
select e.id, r.id, false, 'Uso compartido a nivel nacional'
from public.dictionary_entries e
cross join (select id from public.dictionary_regions where slug = 'colombia') r
where exists (select 1 from unnest(e.geographic_scope) gs where gs ilike '%colombia%')
on conflict (entry_id, region_id) do nothing;
