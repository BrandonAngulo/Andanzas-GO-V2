-- Arregla la repetición de preguntas en la trivia (todos los modos).
--
-- Diagnóstico: el orden anterior de compose_game_questions ponderaba mucho el ajuste de
-- dificultad (peso 0.65) y casi nada el azar (random()*0.08), dejando un top casi fijo.
-- Medido con la selección real del cliente (3 por nivel): ~11 de 15 preguntas se repetían
-- entre partidas consecutivas, y lo mismo al "Reintentar" o cambiar de modo (comparten
-- game_id y RPC). El banco es amplio (924 publicadas en TRIVIA GO), así que no era falta
-- de contenido sino un problema de selección.
--
-- Nuevo criterio de orden:
--   1) preguntas NO vistas primero (separación dura: las vistas siempre después);
--   2) entre las vistas, preferir las menos recientes;
--   3) empujón LEVE hacia la dificultad acorde al dominio del jugador (peso bajo);
--   4) aleatoriedad DOMINANTE para que cada partida varíe de verdad.
-- La distribución por niveles la sigue controlando level_distribution en el cliente.
--
-- Resultado tras el cambio: 0 de 15 preguntas repetidas entre partidas consecutivas y
-- todos los niveles bien representados en el pool.
CREATE OR REPLACE FUNCTION public.compose_game_questions(p_game_id uuid, p_user_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 15, p_theme text DEFAULT NULL::text)
 RETURNS SETOF game_questions
 LANGUAGE sql
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT q.* FROM public.game_questions q
  LEFT JOIN public.question_performance_metrics m ON m.question_id = q.id
  LEFT JOIN LATERAL (
    SELECT avg(utm.mastery) mastery FROM public.question_topic_links l
    JOIN public.user_topic_mastery utm ON utm.topic_id = l.topic_id AND utm.user_id = p_user_id
    WHERE l.question_id = q.id
  ) u ON true
  LEFT JOIN LATERAL (
    SELECT max(a.answered_at) last_seen FROM public.game_answers a
    JOIN public.game_sessions s ON s.id = a.session_id
    WHERE a.question_id = q.id AND s.user_id = p_user_id AND s.game_id = p_game_id
  ) seen ON true
  WHERE q.game_id = p_game_id AND q.status = 'published'
    AND (p_theme IS NULL OR p_theme = 'all' OR q.category = p_theme OR q.campaign = p_theme)
  ORDER BY
    (
      (CASE WHEN seen.last_seen IS NULL THEN 0 ELSE 100 END)
      + CASE WHEN seen.last_seen IS NULL THEN 0
             ELSE greatest(0, 20 - extract(epoch from (now() - seen.last_seen)) / 86400) END
      + abs(coalesce(m.empirical_difficulty, greatest(0.05, least(0.95, (q.level - 1) / 4.0))) - (1 - coalesce(u.mastery, 0.5))) * 3
      - random() * 10
    ) ASC,
    q.level
  LIMIT greatest(1, least(coalesce(p_limit, 15), 500));
$function$;
