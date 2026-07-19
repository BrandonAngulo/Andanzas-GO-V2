-- Consolida la antigua trivia independiente del Valle como experiencia regional
-- dentro de TRIVIA GO. Conserva las categorías editoriales de cada pregunta.

BEGIN;

UPDATE public.game_questions
SET
  game_id = '81111111-1111-1111-1111-111111111111',
  campaign = 'region_valle_del_cauca',
  updated_at = now()
WHERE game_id = '83333333-3333-3333-3333-333333333333';

UPDATE public.games
SET
  title = 'TRIVIA GO',
  slug = 'trivia-go',
  description = 'Explora ciudades y regiones con Andi: elige una experiencia, responde a tu ritmo y descubre algo nuevo en cada partida.',
  cover_title = 'TRIVIA GO',
  cover_subtitle = 'Culturas, lugares y sorpresas por descubrir',
  difficulty_level = NULL,
  updated_at = now()
WHERE id = '81111111-1111-1111-1111-111111111111';

UPDATE public.games
SET
  status = 'archived',
  featured = false,
  updated_at = now()
WHERE id = '83333333-3333-3333-3333-333333333333';

UPDATE public.promoted_banners
SET
  title = 'TRIVIA GO',
  subtitle = 'Explora ciudades y regiones junto a Andi',
  target_id = '81111111-1111-1111-1111-111111111111',
  updated_at = now()
WHERE target_type = 'game'
  AND target_id = '83333333-3333-3333-3333-333333333333';

CREATE INDEX IF NOT EXISTS idx_game_questions_game_campaign
  ON public.game_questions (game_id, campaign);

CREATE OR REPLACE FUNCTION public.compose_game_questions(
  p_game_id uuid,
  p_user_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 15,
  p_theme text DEFAULT NULL
)
RETURNS SETOF public.game_questions
LANGUAGE sql
VOLATILE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT q.* FROM public.game_questions q
  LEFT JOIN public.question_performance_metrics m ON m.question_id = q.id
  LEFT JOIN LATERAL (
    SELECT avg(utm.mastery) mastery FROM public.question_topic_links l
    JOIN public.user_topic_mastery utm
      ON utm.topic_id = l.topic_id
      AND utm.user_id = p_user_id
    WHERE l.question_id = q.id
  ) u ON true
  LEFT JOIN LATERAL (
    SELECT max(a.answered_at) last_seen FROM public.game_answers a
    JOIN public.game_sessions s ON s.id = a.session_id
    WHERE a.question_id = q.id
      AND s.user_id = p_user_id
      AND s.game_id = p_game_id
  ) seen ON true
  WHERE q.game_id = p_game_id
    AND q.status = 'published'
    AND (
      p_theme IS NULL
      OR p_theme = 'all'
      OR q.category = p_theme
      OR q.campaign = p_theme
    )
  ORDER BY
    (
      CASE
        WHEN seen.last_seen IS NULL THEN 0.35
        ELSE greatest(
          0,
          0.20 - extract(epoch from (now() - seen.last_seen)) / 86400 / 150
        )
      END
      + abs(
          coalesce(
            m.empirical_difficulty,
            greatest(0.05, least(0.95, (q.level - 1) / 4.0))
          )
          - (1 - coalesce(u.mastery, 0.5))
        ) * -0.65
      + random() * 0.08
    ) DESC,
    q.level
  LIMIT greatest(1, least(coalesce(p_limit, 15), 500));
$$;

REVOKE ALL ON FUNCTION public.compose_game_questions(uuid, uuid, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.compose_game_questions(uuid, uuid, integer, text) TO anon, authenticated;

COMMIT;
