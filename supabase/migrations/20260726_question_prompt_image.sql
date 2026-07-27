-- Imagen opcional en el ENUNCIADO de una pregunta (independiente del tipo).
-- Habilita el patrón "1 imagen + opciones de texto" (ej. "¿Cómo se llama este instrumento?"),
-- mucho más eficiente que image_choice (1 imagen vs 4). No cambia la lógica de respuesta.
alter table public.game_questions add column if not exists prompt_image_url text;
