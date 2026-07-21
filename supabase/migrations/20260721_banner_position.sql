-- Reposicionamiento del banner de perfil por usuario. ADITIVO.
-- El banner (imagen) es compartido, pero cada usuario elige qué parte se ve.
-- Guardamos punto focal + zoom como jsonb: { "x": 0..100, "y": 0..100, "zoom": 1..3 }.
-- null = centrado por defecto. Se resetea al equipar otro banner (lo hace el cliente).

alter table public.profiles
  add column if not exists banner_position jsonb;
