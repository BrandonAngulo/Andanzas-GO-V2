-- Endurecimiento del catálogo progresivo de preguntas.
-- Las funciones de normalización usan un search_path fijo y el trigger no se
-- expone como RPC: Postgres lo ejecuta únicamente al mutar game_questions.

alter function public.normalize_game_content_key(text)
  set search_path = public, pg_temp;

alter function public.normalize_game_question_text(text)
  set search_path = public, pg_temp;

revoke execute on function public.catalog_game_question_dimensions()
  from public, anon, authenticated;
