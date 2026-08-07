-- Índices y políticas específicas para evitar evaluaciones redundantes.

create index if not exists game_question_category_aliases_category_idx
  on public.game_question_category_aliases (game_id, category_key);

drop policy if exists game_question_scopes_staff on public.game_question_scopes;
create policy game_question_scopes_staff_insert on public.game_question_scopes
  for insert to authenticated with check (public.is_staff());
create policy game_question_scopes_staff_update on public.game_question_scopes
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy game_question_scopes_staff_delete on public.game_question_scopes
  for delete to authenticated using (public.is_staff());

drop policy if exists game_question_categories_staff on public.game_question_categories;
create policy game_question_categories_staff_insert on public.game_question_categories
  for insert to authenticated with check (public.is_staff());
create policy game_question_categories_staff_update on public.game_question_categories
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy game_question_categories_staff_delete on public.game_question_categories
  for delete to authenticated using (public.is_staff());
