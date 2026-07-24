-- Gestor de insignias: habilita escritura (crear/editar/eliminar) para admin/editor.
-- La tabla badges solo tenía lectura pública ("Public Read Badges"), que se conserva.
alter table public.badges enable row level security;

drop policy if exists badges_staff_insert on public.badges;
create policy badges_staff_insert on public.badges
    for insert to authenticated
    with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));

drop policy if exists badges_staff_update on public.badges;
create policy badges_staff_update on public.badges
    for update to authenticated
    using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])))
    with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));

drop policy if exists badges_staff_delete on public.badges;
create policy badges_staff_delete on public.badges
    for delete to authenticated
    using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and (p.role)::text = any (array['admin','editor'])));
