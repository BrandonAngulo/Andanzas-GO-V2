-- Encuadre de imagen (punto focal + zoom) para las superficies de contenido gestionadas en admin.
-- ADITIVO. Misma convención que profiles.banner_position: jsonb { x:0..100, y:0..100, zoom:1..3 }.
-- null = centrado por defecto. Se aplica en el render con imagePositionStyle().

alter table public.sites             add column if not exists image_position jsonb;
alter table public.events            add column if not exists image_position jsonb;
alter table public.routes            add column if not exists image_position jsonb;
alter table public.promoted_banners  add column if not exists image_position jsonb;
alter table public.app_banners       add column if not exists image_position jsonb;
alter table public.dictionary_entries add column if not exists image_position jsonb;
alter table public.learn_entries     add column if not exists image_position jsonb;
alter table public.games             add column if not exists image_position jsonb;
