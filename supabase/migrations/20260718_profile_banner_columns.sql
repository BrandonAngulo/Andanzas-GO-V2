-- Fix (bug recurrente) — Premio de banners de perfil.
-- El cliente escribe/lee `profiles.unlocked_banners` y `profiles.selected_banner_id`
-- (services/user.service.ts updateProfileData; components/panels/PerfilPanel.tsx), pero
-- esas columnas NUNCA existieron en la tabla `profiles`. Resultado: el desbloqueo del banner
-- se calculaba en estado local pero fallaba al persistir, y se re-disparaba cada sesión.
-- Fix: crear las columnas (aditivo). `getProfile` hace select('*'), así que aparecen solas.

alter table public.profiles
  add column if not exists unlocked_banners text[] not null default '{}'::text[],
  add column if not exists selected_banner_id text;
