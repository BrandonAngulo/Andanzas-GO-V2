-- Editable section/profile banners with bilingual (ES/EN) title + subtitle.
-- Replaces the previous, silently-broken approach that queried non-existent
-- section_key/image_url/is_active columns on institutional_content.

create table if not exists public.app_banners (
  key         text primary key,
  scope       text not null default 'app',        -- 'app' | 'profile'
  title_es    text,
  subtitle_es text,
  title_en    text,
  subtitle_en text,
  image_url   text,
  is_active   boolean not null default true,
  updated_at  timestamptz default now()
);

alter table public.app_banners enable row level security;

drop policy if exists "public read app_banners" on public.app_banners;
create policy "public read app_banners" on public.app_banners for select using (true);

drop policy if exists "admin write app_banners" on public.app_banners;
create policy "admin write app_banners" on public.app_banners for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','editor'))
);

-- Seed app section banners with the current in-code defaults (ES + EN)
insert into public.app_banners (key, scope, title_es, subtitle_es, title_en, subtitle_en, image_url) values
  ('explorar', 'app',
    '¿Qué querés vivir hoy en Cali?',
    'No somos solo un mapa. Elegí una experiencia y dejá que te guiemos paso a paso por lo mejor de la ciudad.',
    'What do you want to experience today?',
    'We are not just a map. Choose an experience and let us guide you step by step through the best of the city.',
    '/images/banner_explorar.png'),
  ('juegos', 'app',
    'Zona de Juegos',
    'Demuestra cuánto sabes sobre la cultura, gana puntos y compite en el ranking global.',
    'Play Zone',
    'Show how much you know about culture, earn points and compete on the global ranking.',
    '/images/banner_juegos.png'),
  ('paquesepas', 'app',
    'Pa'' que sepás',
    'Aprende sobre la cultura, la historia y los secretos mejor guardados de la ciudad. El por qué importa lo que ves.',
    'Did you know?',
    'Learn about the culture, history and best-kept secrets of the city. Why what you see matters.',
    '/images/banner_aprende.png'),
  ('rutas', 'app',
    'Pasaporte de Rutas',
    'Explora circuitos diseñados y colecciona estampillas por cada ruta completada.',
    'Route Passport',
    'Explore curated circuits and collect stamps for every completed route.',
    '/images/banner_rutas.png'),
  ('eventos', 'app',
    'Cartelera Cultural',
    'Cali vibra con cultura todos los días. Explora lo que está ocurriendo hoy, lo que se viene o ese plan perfecto a tu medida.',
    'Cultural Billboard',
    'Cali pulses with culture every day. Explore what is happening today, what is coming, or the perfect plan for you.',
    '/images/banner_eventos.png')
on conflict (key) do nothing;

-- Seed profile reward banners from AVAILABLE_BANNERS (components/panels/BannerGalleryModal.tsx)
insert into public.app_banners (key, scope, title_es, subtitle_es, image_url) values
  ('profile_banner_banner_bulevar_rio', 'profile', 'Bulevar del Río', 'Deja tu primera reseña', '/images/banners/banner_bulevar_rio.png'),
  ('profile_banner_banner_la_ermita', 'profile', 'La Ermita', 'Guarda tu primera ruta en "Por Andar"', '/images/banners/banner_la_ermita.png'),
  ('profile_banner_banner_tres_cruces', 'profile', 'Cerro Tres Cruces', 'Alcanza el Nivel 3 de Explorador', '/images/banners/banner_tres_cruces.png'),
  ('profile_banner_banner_torre_cali', 'profile', 'Torre de Cali', 'Completa tu primera ruta guiada', '/images/banners/banner_torre_cali.png'),
  ('profile_banner_banner_bulevar_oriente', 'profile', 'Bulevar de Oriente', 'Gana 5 insignias culturales', '/images/banners/banner_bulevar_oriente.png'),
  ('profile_banner_banner_san_antonio', 'profile', 'Capilla San Antonio', 'Invita a un amigo a usar la app', '/images/banners/banner_san_antonio.png')
on conflict (key) do nothing;
