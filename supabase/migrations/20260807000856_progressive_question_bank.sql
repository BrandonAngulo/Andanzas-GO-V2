-- Catálogo progresivo de contenido para TRIVIA GO.
-- Los ámbitos y categorías dejan de depender de listas fijas del frontend.

create or replace function public.normalize_game_content_key(value text)
returns text
language sql
immutable
parallel safe
as $$
  select trim(both '_' from lower(regexp_replace(
    translate(coalesce(value, ''), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
    '[^a-zA-Z0-9]+', '_', 'g'
  )));
$$;

create or replace function public.normalize_game_question_text(value text)
returns text
language sql
immutable
parallel safe
as $$
  select lower(regexp_replace(
    translate(coalesce(value, ''), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
    '[^a-zA-Z0-9]+', '', 'g'
  ));
$$;

create table if not exists public.game_question_scopes (
  game_id uuid not null references public.games(id) on delete cascade,
  key text not null,
  label text not null,
  kind text not null default 'topic' check (kind in ('global', 'country', 'region', 'city', 'place', 'topic')),
  parent_key text,
  is_playable boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  icon_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (game_id, key),
  constraint game_question_scopes_key_format check (key = public.normalize_game_content_key(key))
);

create table if not exists public.game_question_categories (
  game_id uuid not null references public.games(id) on delete cascade,
  key text not null,
  label text not null,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (game_id, key),
  constraint game_question_categories_key_format check (key = public.normalize_game_content_key(key))
);

create table if not exists public.game_question_category_aliases (
  game_id uuid not null,
  alias_key text not null,
  category_key text not null,
  created_at timestamptz not null default now(),
  primary key (game_id, alias_key),
  foreign key (game_id, category_key)
    references public.game_question_categories(game_id, key)
    on delete cascade
);

alter table public.game_question_scopes enable row level security;
alter table public.game_question_categories enable row level security;
alter table public.game_question_category_aliases enable row level security;

drop policy if exists game_question_scopes_read on public.game_question_scopes;
create policy game_question_scopes_read on public.game_question_scopes
  for select to anon, authenticated using (is_active or public.is_staff());
drop policy if exists game_question_scopes_staff on public.game_question_scopes;
create policy game_question_scopes_staff on public.game_question_scopes
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists game_question_categories_read on public.game_question_categories;
create policy game_question_categories_read on public.game_question_categories
  for select to anon, authenticated using (is_active or public.is_staff());
drop policy if exists game_question_categories_staff on public.game_question_categories;
create policy game_question_categories_staff on public.game_question_categories
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists game_question_category_aliases_staff on public.game_question_category_aliases;
create policy game_question_category_aliases_staff on public.game_question_category_aliases
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

grant select on public.game_question_scopes, public.game_question_categories to anon, authenticated;
grant insert, update, delete on public.game_question_scopes, public.game_question_categories, public.game_question_category_aliases to authenticated;

insert into public.game_question_scopes
  (game_id, key, label, kind, parent_key, is_playable, is_active, sort_order, icon_key)
values
  ('81111111-1111-1111-1111-111111111111', 'world_general', 'Banco global (Clásica)', 'global', null, false, true, 0, 'globe'),
  ('81111111-1111-1111-1111-111111111111', 'country_colombia', 'Colombia', 'country', 'world_general', true, true, 10, 'colombia'),
  ('81111111-1111-1111-1111-111111111111', 'region_valle_del_cauca', 'Valle del Cauca', 'region', 'country_colombia', true, true, 20, 'sugar_cane'),
  ('81111111-1111-1111-1111-111111111111', 'city_cali', 'Cali', 'city', 'region_valle_del_cauca', true, true, 30, 'salsa'),
  ('81111111-1111-1111-1111-111111111111', 'vocabulario', 'Vocabulario caleño', 'topic', 'city_cali', true, true, 40, 'vocabulary')
on conflict (game_id, key) do update set
  label = excluded.label,
  kind = excluded.kind,
  parent_key = excluded.parent_key,
  is_playable = excluded.is_playable,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  icon_key = excluded.icon_key,
  updated_at = now();

insert into public.game_question_categories (game_id, key, label, sort_order)
values
  ('81111111-1111-1111-1111-111111111111', 'arte_y_cultura', 'Arte y cultura', 10),
  ('81111111-1111-1111-1111-111111111111', 'ciencia_y_tecnologia', 'Ciencia y tecnología', 20),
  ('81111111-1111-1111-1111-111111111111', 'cultura_e_identidad', 'Cultura e identidad', 40),
  ('81111111-1111-1111-1111-111111111111', 'deportes', 'Deportes', 50),
  ('81111111-1111-1111-1111-111111111111', 'gastronomia', 'Gastronomía', 60),
  ('81111111-1111-1111-1111-111111111111', 'geografia_y_territorio', 'Geografía y territorio', 70),
  ('81111111-1111-1111-1111-111111111111', 'historia', 'Historia', 80),
  ('81111111-1111-1111-1111-111111111111', 'literatura', 'Literatura', 90),
  ('81111111-1111-1111-1111-111111111111', 'leyendas', 'Leyendas', 100),
  ('81111111-1111-1111-1111-111111111111', 'musica', 'Música', 110),
  ('81111111-1111-1111-1111-111111111111', 'naturaleza_y_ambiente', 'Naturaleza y ambiente', 120)
on conflict (game_id, key) do update set label = excluded.label, sort_order = excluded.sort_order, is_active = true, updated_at = now();

insert into public.game_question_category_aliases (game_id, alias_key, category_key)
values
  ('81111111-1111-1111-1111-111111111111', 'cine_y_series', 'arte_y_cultura'),
  ('81111111-1111-1111-1111-111111111111', 'gastronomia_del_mundo', 'gastronomia'),
  ('81111111-1111-1111-1111-111111111111', 'mitos_y_leyendas', 'leyendas')
on conflict (game_id, alias_key) do update set category_key = excluded.category_key;

-- Registra automáticamente dimensiones nuevas. Los ámbitos nacen inactivos/no jugables:
-- un editor debe nombrarlos y activarlos antes de que aparezcan al público.
create or replace function public.catalog_game_question_dimensions()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  raw_key text;
  canonical_key text;
  canonical_label text;
begin
  if new.game_id is null then
    return new;
  end if;

  if new.campaign is not null and btrim(new.campaign) <> '' then
    raw_key := public.normalize_game_content_key(new.campaign);
    new.campaign := raw_key;
    insert into public.game_question_scopes (game_id, key, label, is_active, is_playable)
    values (new.game_id, raw_key, initcap(replace(raw_key, '_', ' ')), false, false)
    on conflict (game_id, key) do nothing;
  end if;

  if new.category is not null and btrim(new.category) <> '' then
    raw_key := public.normalize_game_content_key(new.category);
    select a.category_key into canonical_key
      from public.game_question_category_aliases a
      where a.game_id = new.game_id and a.alias_key = raw_key;
    canonical_key := coalesce(canonical_key, raw_key);

    insert into public.game_question_categories (game_id, key, label)
    values (new.game_id, canonical_key, btrim(new.category))
    on conflict (game_id, key) do nothing;

    select c.label into canonical_label
      from public.game_question_categories c
      where c.game_id = new.game_id and c.key = canonical_key;
    new.category := canonical_label;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_catalog_game_question_dimensions on public.game_questions;
create trigger trg_catalog_game_question_dimensions
before insert or update of game_id, campaign, category on public.game_questions
for each row execute function public.catalog_game_question_dimensions();

-- Registra cualquier dimensión histórica que no estuviera en la semilla.
insert into public.game_question_categories (game_id, key, label)
select distinct q.game_id, public.normalize_game_content_key(q.category), btrim(q.category)
from public.game_questions q
where q.game_id is not null and q.category is not null and btrim(q.category) <> ''
on conflict (game_id, key) do nothing;

insert into public.game_question_scopes (game_id, key, label, is_active, is_playable)
select distinct q.game_id, public.normalize_game_content_key(q.campaign), initcap(replace(public.normalize_game_content_key(q.campaign), '_', ' ')), false, false
from public.game_questions q
where q.game_id is not null and q.campaign is not null and btrim(q.campaign) <> ''
on conflict (game_id, key) do nothing;

-- La igualdad normalizada queda protegida para todos los lotes futuros, incluido el panel.
create unique index if not exists uq_game_questions_normalized_text_active
on public.game_questions (game_id, public.normalize_game_question_text(question_text))
where coalesce(status, 'draft') <> 'archived';

create index if not exists idx_game_questions_composer_pool
on public.game_questions (game_id, status, campaign, level, question_type);

create index if not exists idx_game_questions_category_pool
on public.game_questions (game_id, status, category, level);

comment on table public.game_question_scopes is 'Ámbitos editoriales/jugables de TRIVIA GO. Se administran sin cambiar el frontend.';
comment on table public.game_question_categories is 'Taxonomía canónica de categorías por juego; las preguntas nuevas se registran automáticamente.';
comment on function public.catalog_game_question_dimensions() is 'Normaliza y registra campaign/category en cada alta o edición de preguntas.';
