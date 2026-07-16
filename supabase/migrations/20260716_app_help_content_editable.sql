-- Editable contextual help texts (panel "?" hints + profile points/economy),
-- bilingual (ES/EN), so they can be edited from the admin without touching code.
-- Body is stored as plain text: blank lines separate paragraphs and lines
-- starting with "- " render as a bulleted list.

create table if not exists public.app_help_content (
  key         text primary key,               -- panel key ('mapa', 'perfil', ...) or 'economy'
  title_es    text,
  body_es     text,
  title_en    text,
  body_en     text,
  is_active   boolean not null default true,
  updated_at  timestamptz default now()
);

alter table public.app_help_content enable row level security;

drop policy if exists "public read app_help_content" on public.app_help_content;
create policy "public read app_help_content" on public.app_help_content for select using (true);

drop policy if exists "admin write app_help_content" on public.app_help_content;
create policy "admin write app_help_content" on public.app_help_content for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','editor'))
);

insert into public.app_help_content (key, title_es, body_es, title_en, body_en) values
  ('mapa',
   'El mapa vivo',
   E'Es un mapa interactivo de los sitios culturales de Cali: museos, teatros, murales, iglesias, bibliotecas y más.\n\nUsa los filtros para acotar por categoría, valoración o accesibilidad, y toca un pin para ver los detalles del lugar.\n\nCon el botón «Vivir / Crear Ruta» puedes armar tu propio recorrido o seguir una ruta guiada paso a paso.',
   'The live map',
   E'An interactive map of Cali''s cultural sites: museums, theaters, murals, churches, libraries and more.\n\nUse the filters to narrow by category, rating or accessibility, and tap a pin to see a place''s details.\n\nWith the "Live / Create Route" button you can build your own tour or follow a guided route step by step.'),
  ('favoritos',
   'Tus favoritos',
   E'Aquí se guardan los sitios que marcaste con el corazón.\n\nÚsalos como tu lista personal para volver rápido o armar una ruta a tu medida.',
   'Your favorites',
   E'The sites you marked with a heart are saved here.\n\nUse them as your personal list to come back quickly or build a route your way.'),
  ('reseñas',
   'Mis reseñas',
   E'Reúne todas las opiniones y valoraciones que has dejado en los sitios.\n\nTus aportes ayudan a la comunidad y suman puntos a tu perfil.',
   'My reviews',
   E'All the opinions and ratings you have left on sites, in one place.\n\nYour contributions help the community and earn points for your profile.'),
  ('tendencias',
   'Tendencias',
   'Lo que está sonando en la ciudad ahora mismo: los sitios y planes más visitados y comentados por la comunidad.',
   'Trends',
   'What''s buzzing in the city right now: the sites and plans most visited and talked about by the community.'),
  ('noticias',
   'Noticias y novedades',
   E'Anuncios, novedades culturales y avisos del equipo de Andanzas.\n\nEntérate de nuevos eventos, rutas y funciones de la app.',
   'News & updates',
   E'Announcements, cultural news and messages from the Andanzas team.\n\nFind out about new events, routes and app features.'),
  ('diccionario',
   'Diccionario de la caleñidad',
   E'Un glosario del habla y la cultura caleña.\n\nToca cualquier palabra resaltada en la app para conocer su significado.',
   'Dictionary of caleñidad',
   E'A glossary of Cali''s slang and culture.\n\nTap any highlighted word in the app to learn what it means.'),
  ('perfil',
   'Tu perfil',
   E'Tu pasaporte de explorador: nivel, puntos, insignias, sellos, rutas y aportes.\n\nCompleta tu perfil para guardar rutas, ganar recompensas y personalizar tu experiencia.',
   'Your profile',
   E'Your explorer passport: level, points, badges, stamps, routes and contributions.\n\nComplete your profile to save routes, earn rewards and personalize your experience.'),
  ('economy',
   'Tu progreso en Andanzas',
   E'Cada cosa que haces en la app suma. Así funciona tu progreso:\n\nNivel y XP: ganas experiencia (XP) con tu actividad y subes de nivel, desde «Explorador Novato» hasta «Leyenda de Cali». Tu nivel se muestra junto a tu avatar.\n\nPuntos Andanzas: son tu puntaje principal como explorador y reflejan todo lo que has recorrido y aportado.\n\nMonedas y Gemas: son recompensas que acumulas con tu actividad en la app.\n\nCómo ganar puntos y recompensas:\n- Completar rutas guiadas\n- Dejar reseñas en los sitios que visitas\n- Jugar trivias y retos en la Zona de Juegos\n- Asistir a eventos culturales\n- Guardar sitios en favoritos\n- Compartir tus descubrimientos\n\nPróximamente: podrás canjear tus Monedas y Gemas por beneficios y experiencias exclusivas.',
   'Your progress in Andanzas',
   E'Everything you do in the app counts. Here''s how your progress works:\n\nLevel & XP: you earn experience (XP) through your activity and level up, from "Novice Explorer" to "Legend of Cali". Your level shows next to your avatar.\n\nAndanzas Points: your main explorer score, reflecting everything you have toured and contributed.\n\nCoins & Gems: rewards you accumulate through your activity in the app.\n\nHow to earn points and rewards:\n- Complete guided routes\n- Leave reviews on the sites you visit\n- Play trivia and challenges in the Play Zone\n- Attend cultural events\n- Save sites to favorites\n- Share your discoveries\n\nComing soon: you''ll be able to redeem your Coins and Gems for exclusive benefits and experiences.')
on conflict (key) do nothing;
