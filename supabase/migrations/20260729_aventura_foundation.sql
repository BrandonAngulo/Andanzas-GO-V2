-- AVENTURA: modelo de capítulos, niveles narrativos, asignación de preguntas,
-- personajes desbloqueables y progreso. Ver docs/trivia-go-aventura-contrato.md.
-- Aplicado en Supabase V3 vía apply_migration: aventura_foundation.
-- Decisiones: acceso secuencial (N requiere N-1), práctica repite con antirrepetición,
-- recompensa = personaje (entidad propia: ANDI principal, Pandebono secundario).

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  kind text not null default 'secundario' check (kind in ('principal','secundario')),
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.game_chapters (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  cover_image_url text,
  image_position jsonb,
  reward_character_id uuid references public.characters(id) on delete set null,
  levels_count int not null default 10,
  questions_per_level int not null default 5,
  unlock_min_levels int not null default 10,
  unlock_min_correct int not null default 30,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  version int not null default 1,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_chapter_levels (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.game_chapters(id) on delete cascade,
  level_number int not null,
  title text not null,
  narrative text,
  purpose text,
  questions_per_run int,
  created_at timestamptz not null default now(),
  unique(chapter_id, level_number)
);

create table if not exists public.game_chapter_level_questions (
  chapter_level_id uuid not null references public.game_chapter_levels(id) on delete cascade,
  question_id uuid not null references public.game_questions(id) on delete cascade,
  order_index int not null default 0,
  primary key (chapter_level_id, question_id)
);
create index if not exists idx_gclq_question on public.game_chapter_level_questions(question_id);

create table if not exists public.user_characters (
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  source text,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, character_id)
);

create table if not exists public.user_chapter_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references public.game_chapters(id) on delete cascade,
  levels_completed int not null default 0,
  unique_correct int not null default 0,
  unlocked boolean not null default false,
  unlocked_at timestamptz,
  version int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

create table if not exists public.user_chapter_level_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_level_id uuid not null references public.game_chapter_levels(id) on delete cascade,
  completed boolean not null default false,
  best_score int not null default 0,
  runs int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, chapter_level_id)
);

create table if not exists public.user_chapter_correct (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references public.game_chapters(id) on delete cascade,
  question_id uuid not null references public.game_questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, chapter_id, question_id)
);

alter table public.characters enable row level security;
alter table public.game_chapters enable row level security;
alter table public.game_chapter_levels enable row level security;
alter table public.game_chapter_level_questions enable row level security;
alter table public.user_characters enable row level security;
alter table public.user_chapter_progress enable row level security;
alter table public.user_chapter_level_progress enable row level security;
alter table public.user_chapter_correct enable row level security;

drop policy if exists characters_read_all on public.characters;
create policy characters_read_all on public.characters for select using (true);
drop policy if exists characters_staff_write on public.characters;
create policy characters_staff_write on public.characters for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists chapters_staff_all on public.game_chapters;
create policy chapters_staff_all on public.game_chapters for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists chapters_read_pub on public.game_chapters;
create policy chapters_read_pub on public.game_chapters for select using (status = 'published' or public.is_staff());

drop policy if exists chlevels_staff_all on public.game_chapter_levels;
create policy chlevels_staff_all on public.game_chapter_levels for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists chlq_staff_all on public.game_chapter_level_questions;
create policy chlq_staff_all on public.game_chapter_level_questions for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists uchar_own on public.user_characters;
create policy uchar_own on public.user_characters for select using (user_id = auth.uid());
drop policy if exists ucp_own on public.user_chapter_progress;
create policy ucp_own on public.user_chapter_progress for select using (user_id = auth.uid());
drop policy if exists uclp_own on public.user_chapter_level_progress;
create policy uclp_own on public.user_chapter_level_progress for select using (user_id = auth.uid());
drop policy if exists ucc_own on public.user_chapter_correct;
create policy ucc_own on public.user_chapter_correct for select using (user_id = auth.uid());

-- Hook de elegibilidad: 'aventura' = asignada a un nivel de un capítulo publicado.
create or replace function public.fn_mode_default_eligible(q public.game_questions, p_mode text)
returns boolean language sql stable as $$
  select case p_mode
    when 'reto'         then q.status = 'published'
    when 'practica'     then q.status = 'published'
    when 'contrarreloj' then q.status = 'published' and q.question_type = 'multiple_choice'
    when 'duelo'        then q.status = 'published'
                                and q.question_type in ('multiple_choice','image_choice')
                                and q.explanation is not null and length(btrim(q.explanation)) > 0
    when 'diaria'       then q.status = 'published' and q.question_type = 'multiple_choice'
                                and q.explanation is not null and length(btrim(q.explanation)) > 0
                                and coalesce(q.level, 1) <= 3
    when 'aventura'     then exists (
                                select 1 from public.game_chapter_level_questions clq
                                join public.game_chapter_levels cl on cl.id = clq.chapter_level_id
                                join public.game_chapters c on c.id = cl.chapter_id
                                where clq.question_id = q.id and c.status = 'published')
    else false
  end;
$$;
