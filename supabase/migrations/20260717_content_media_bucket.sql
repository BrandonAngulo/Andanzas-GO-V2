-- =========================================================================
-- BUCKET DE CONTENIDO — Storage público compartido para media editorial
-- generada por tareas automatizadas (rutina de Claude Code y tareas
-- programadas de Codex): imágenes hoy, audio a futuro.
-- Lectura pública (para renderizar en la app); escritura solo para staff
-- autenticado o service_role. Idempotente.
-- Convención de rutas dentro del bucket:
--   stories/<slug-unico>.webp   -> ilustraciones de "Pa' que sepás"
-- URL pública:
--   https://<project>.supabase.co/storage/v1/object/public/content/<ruta>
-- =========================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values ('content', 'content', true, 26214400)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

drop policy if exists "content_public_read" on storage.objects;
create policy "content_public_read" on storage.objects
  for select using (bucket_id = 'content');

drop policy if exists "content_staff_insert" on storage.objects;
create policy "content_staff_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'content' and public.is_staff());

drop policy if exists "content_staff_update" on storage.objects;
create policy "content_staff_update" on storage.objects
  for update to authenticated using (bucket_id = 'content' and public.is_staff())
  with check (bucket_id = 'content' and public.is_staff());

drop policy if exists "content_staff_delete" on storage.objects;
create policy "content_staff_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'content' and public.is_staff());
