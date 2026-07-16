-- Adaptive trivia engine: empirical difficulty, player mastery, editorial checks and composition.
CREATE SCHEMA IF NOT EXISTS game_engine;
REVOKE ALL ON SCHEMA game_engine FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.question_performance_metrics (
  question_id uuid PRIMARY KEY REFERENCES public.game_questions(id) ON DELETE CASCADE,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  timeouts integer NOT NULL DEFAULT 0 CHECK (timeouts >= 0),
  avg_time_ms numeric NOT NULL DEFAULT 0 CHECK (avg_time_ms >= 0),
  empirical_difficulty numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (empirical_difficulty BETWEEN 0 AND 1),
  confidence numeric(5,4) NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 1),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_topic_mastery (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.question_topics(id) ON DELETE CASCADE,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  mastery numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (mastery BETWEEN 0 AND 1),
  last_answered_at timestamptz,
  next_review_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS public.user_category_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  category text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  mastery numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (mastery BETWEEN 0 AND 1),
  xp integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level integer NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 10),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, game_id, category)
);

CREATE TABLE IF NOT EXISTS public.question_editorial_checks (
  question_id uuid PRIMARY KEY REFERENCES public.game_questions(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  checked_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_question_metrics_difficulty ON public.question_performance_metrics(empirical_difficulty);
CREATE INDEX IF NOT EXISTS idx_topic_mastery_user_review ON public.user_topic_mastery(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_category_progress_user_game ON public.user_category_progress(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_topic_links_question_primary ON public.question_topic_links(question_id, is_primary);

ALTER TABLE public.question_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_category_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_editorial_checks ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.question_performance_metrics TO anon, authenticated;
GRANT SELECT ON public.user_topic_mastery, public.user_category_progress TO authenticated;
GRANT SELECT ON public.question_editorial_checks TO authenticated;

DROP POLICY IF EXISTS "Published question metrics are readable" ON public.question_performance_metrics;
CREATE POLICY "Published question metrics are readable" ON public.question_performance_metrics FOR SELECT
TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.game_questions q WHERE q.id = question_id AND q.status = 'published'));
DROP POLICY IF EXISTS "Players read own topic mastery" ON public.user_topic_mastery;
CREATE POLICY "Players read own topic mastery" ON public.user_topic_mastery FOR SELECT
TO authenticated USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Players read own category progress" ON public.user_category_progress;
CREATE POLICY "Players read own category progress" ON public.user_category_progress FOR SELECT
TO authenticated USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Staff read editorial checks" ON public.question_editorial_checks;
CREATE POLICY "Staff read editorial checks" ON public.question_editorial_checks FOR SELECT
TO authenticated USING ((SELECT public.is_staff()));

-- Seed a first concept layer from the curated categories and link every question to its category concept.
UPDATE public.game_questions SET category='General', updated_at=now()
WHERE game_id='81111111-1111-1111-1111-111111111111' AND (category IS NULL OR trim(category)='');
INSERT INTO public.question_topics(key, label, description)
SELECT DISTINCT
  lower(regexp_replace(trim(category), '[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+', '-', 'g')),
  trim(category),
  'Concepto editorial derivado de la categoría de la pregunta.'
FROM public.game_questions
WHERE category IS NOT NULL AND trim(category) <> ''
ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, updated_at = now();

INSERT INTO public.question_topic_links(question_id, topic_id, is_primary)
SELECT q.id, t.id, true
FROM public.game_questions q
JOIN public.question_topics t ON t.key = lower(regexp_replace(trim(q.category), '[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+', '-', 'g'))
WHERE q.category IS NOT NULL
ON CONFLICT (question_id, topic_id) DO UPDATE SET is_primary = true;

INSERT INTO public.question_topics(key,label,description) VALUES ('general','General','Preguntas transversales sin categoría editorial específica')
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.question_topic_links(question_id,topic_id,is_primary)
SELECT q.id,t.id,true FROM public.game_questions q CROSS JOIN public.question_topics t
WHERE t.key='general' AND NOT EXISTS (SELECT 1 FROM public.question_topic_links l WHERE l.question_id=q.id)
ON CONFLICT (question_id,topic_id) DO NOTHING;

CREATE OR REPLACE FUNCTION game_engine.capture_answer_learning()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, game_engine, pg_temp
AS $$
DECLARE
  v_user_id uuid;
  v_game_id uuid;
  v_category text;
  v_time_limit_ms numeric;
  v_difficulty numeric;
  v_signal numeric;
  v_xp integer;
BEGIN
  SELECT s.user_id, s.game_id, q.category, greatest(coalesce(q.time_limit_sec, 30) * 1000, 1000)
  INTO v_user_id, v_game_id, v_category, v_time_limit_ms
  FROM public.game_sessions s
  JOIN public.game_questions q ON q.id = NEW.question_id
  WHERE s.id = NEW.session_id;

  INSERT INTO public.question_performance_metrics(question_id, attempts, correct_answers, timeouts, avg_time_ms, empirical_difficulty, confidence, updated_at)
  VALUES (NEW.question_id, 1, CASE WHEN NEW.is_correct THEN 1 ELSE 0 END, CASE WHEN NEW.timed_out THEN 1 ELSE 0 END,
    coalesce(NEW.time_to_answer_ms, 0),
    least(1, greatest(0, 1 - ((CASE WHEN NEW.is_correct THEN 1 ELSE 0 END + 3.0) / 7.0) + CASE WHEN NEW.timed_out THEN 0.15 ELSE 0 END)),
    1.0 / 20.0, now())
  ON CONFLICT (question_id) DO UPDATE SET
    attempts = question_performance_metrics.attempts + 1,
    correct_answers = question_performance_metrics.correct_answers + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
    timeouts = question_performance_metrics.timeouts + CASE WHEN NEW.timed_out THEN 1 ELSE 0 END,
    avg_time_ms = ((question_performance_metrics.avg_time_ms * question_performance_metrics.attempts) + coalesce(NEW.time_to_answer_ms,0)) / (question_performance_metrics.attempts + 1),
    empirical_difficulty = least(1, greatest(0,
      1 - ((question_performance_metrics.correct_answers + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END + 3.0) / (question_performance_metrics.attempts + 7.0))
      + ((question_performance_metrics.timeouts + CASE WHEN NEW.timed_out THEN 1 ELSE 0 END)::numeric / (question_performance_metrics.attempts + 1)) * 0.15)),
    confidence = least(1, (question_performance_metrics.attempts + 1) / 20.0), updated_at = now()
  RETURNING empirical_difficulty INTO v_difficulty;

  IF v_user_id IS NOT NULL THEN
    v_signal := CASE WHEN NEW.is_correct THEN greatest(0.55, 1 - v_difficulty * 0.25) ELSE least(0.45, v_difficulty * 0.35) END;
    INSERT INTO public.user_topic_mastery(user_id, topic_id, attempts, correct_answers, mastery, last_answered_at, next_review_at)
    SELECT v_user_id, l.topic_id, 1, CASE WHEN NEW.is_correct THEN 1 ELSE 0 END, v_signal, now(),
      now() + CASE WHEN NEW.is_correct THEN interval '3 days' ELSE interval '8 hours' END
    FROM public.question_topic_links l WHERE l.question_id = NEW.question_id
    ON CONFLICT (user_id, topic_id) DO UPDATE SET attempts = user_topic_mastery.attempts + 1,
      correct_answers = user_topic_mastery.correct_answers + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
      mastery = least(1, greatest(0, user_topic_mastery.mastery * 0.8 + v_signal * 0.2)),
      last_answered_at = now(), next_review_at = now() + CASE WHEN NEW.is_correct THEN interval '3 days' ELSE interval '8 hours' END, updated_at = now();

    v_xp := CASE WHEN NEW.is_correct THEN 10 + coalesce(NEW.points_earned,0) / 20 ELSE 2 END;
    INSERT INTO public.user_category_progress(user_id, game_id, category, attempts, correct_answers, mastery, xp, level)
    VALUES (v_user_id, v_game_id, coalesce(v_category,'General'), 1, CASE WHEN NEW.is_correct THEN 1 ELSE 0 END, v_signal, v_xp, least(10, 1 + v_xp / 250))
    ON CONFLICT (user_id, game_id, category) DO UPDATE SET attempts = user_category_progress.attempts + 1,
      correct_answers = user_category_progress.correct_answers + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
      mastery = least(1, greatest(0, user_category_progress.mastery * 0.8 + v_signal * 0.2)),
      xp = user_category_progress.xp + v_xp,
      level = least(10, 1 + (user_category_progress.xp + v_xp) / 250), updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_capture_answer_learning ON public.game_answers;
CREATE TRIGGER trg_capture_answer_learning AFTER INSERT ON public.game_answers
FOR EACH ROW EXECUTE FUNCTION game_engine.capture_answer_learning();

-- Backfill empirical metrics from existing answers.
INSERT INTO public.question_performance_metrics(question_id, attempts, correct_answers, timeouts, avg_time_ms, empirical_difficulty, confidence, updated_at)
SELECT q.id, count(a.id), count(*) FILTER (WHERE a.is_correct), count(*) FILTER (WHERE a.timed_out),
  coalesce(avg(a.time_to_answer_ms),0),
  least(1, greatest(0, 1 - ((count(*) FILTER (WHERE a.is_correct) + 3.0) / (count(a.id) + 6.0)) + (count(*) FILTER (WHERE a.timed_out)::numeric / greatest(count(a.id),1)) * 0.15 + least(coalesce(avg(a.time_to_answer_ms),0) / greatest(coalesce(q.time_limit_sec,30) * 1000,1000),1) * 0.10)),
  least(1, count(a.id) / 20.0), now()
FROM public.game_questions q JOIN public.game_answers a ON a.question_id = q.id GROUP BY q.id, q.time_limit_sec
ON CONFLICT (question_id) DO UPDATE SET attempts=EXCLUDED.attempts, correct_answers=EXCLUDED.correct_answers, timeouts=EXCLUDED.timeouts, avg_time_ms=EXCLUDED.avg_time_ms, empirical_difficulty=EXCLUDED.empirical_difficulty, confidence=EXCLUDED.confidence, updated_at=now();

CREATE OR REPLACE FUNCTION public.compose_game_questions(p_game_id uuid, p_user_id uuid DEFAULT NULL, p_limit integer DEFAULT 15, p_theme text DEFAULT NULL)
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
    JOIN public.user_topic_mastery utm ON utm.topic_id=l.topic_id AND utm.user_id=p_user_id
    WHERE l.question_id=q.id
  ) u ON true
  LEFT JOIN LATERAL (
    SELECT max(a.answered_at) last_seen FROM public.game_answers a
    JOIN public.game_sessions s ON s.id=a.session_id
    WHERE a.question_id=q.id AND s.user_id=p_user_id AND s.game_id=p_game_id
  ) seen ON true
  WHERE q.game_id=p_game_id AND q.status='published'
    AND (p_theme IS NULL OR p_theme='all' OR q.category=p_theme)
  ORDER BY
    (CASE WHEN seen.last_seen IS NULL THEN 0.35 ELSE greatest(0, 0.20 - extract(epoch from (now()-seen.last_seen))/86400/150) END
     + abs(coalesce(m.empirical_difficulty, greatest(0.05, least(0.95,(q.level-1)/4.0))) - (1-coalesce(u.mastery,0.5))) * -0.65
     + random()*0.08) DESC,
    q.level
  LIMIT greatest(1, least(coalesce(p_limit,15),500));
$$;
REVOKE ALL ON FUNCTION public.compose_game_questions(uuid,uuid,integer,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.compose_game_questions(uuid,uuid,integer,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.refresh_question_editorial_checks(p_game_id uuid DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE v_count integer;
BEGIN
  IF NOT (SELECT public.is_staff()) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  INSERT INTO public.question_editorial_checks(question_id, score, issues, warnings, checked_at)
  SELECT q.id,
    greatest(0, 100 - jsonb_array_length(x.issues)*25 - jsonb_array_length(x.warnings)*10), x.issues, x.warnings, now()
  FROM public.game_questions q
  CROSS JOIN LATERAL (SELECT
    (SELECT jsonb_agg(v) FROM (VALUES
      (CASE WHEN length(trim(q.question_text)) < 15 THEN 'Pregunta demasiado corta' END),
      (CASE WHEN q.correct_answer IS NULL THEN 'Falta respuesta correcta' END),
      (CASE WHEN q.explanation IS NULL OR length(trim(q.explanation)) < 20 THEN 'Falta explicación editorial suficiente' END)
    ) z(v) WHERE v IS NOT NULL) issues,
    (SELECT jsonb_agg(v) FROM (VALUES
      (CASE WHEN q.category IS NULL THEN 'Falta categoría' END),
      (CASE WHEN q.question_type='multiple_choice' AND jsonb_array_length(q.options) < 2 THEN 'Pocas opciones' END),
      (CASE WHEN EXISTS (SELECT 1 FROM public.game_questions d WHERE d.game_id=q.game_id AND d.id<>q.id AND lower(regexp_replace(d.question_text,'[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+','','g'))=lower(regexp_replace(q.question_text,'[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+','','g'))) THEN 'Posible duplicado' END)
    ) z(v) WHERE v IS NOT NULL) warnings
  ) raw
  CROSS JOIN LATERAL (SELECT coalesce(raw.issues,'[]'::jsonb) issues, coalesce(raw.warnings,'[]'::jsonb) warnings) x
  WHERE p_game_id IS NULL OR q.game_id=p_game_id
  ON CONFLICT(question_id) DO UPDATE SET score=EXCLUDED.score,issues=EXCLUDED.issues,warnings=EXCLUDED.warnings,checked_at=now();
  GET DIAGNOSTICS v_count = ROW_COUNT; RETURN v_count;
END;
$$;
REVOKE ALL ON FUNCTION public.refresh_question_editorial_checks(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refresh_question_editorial_checks(uuid) TO authenticated;

-- Initial cross-links: category to route, and exact named places mentioned in question content.
INSERT INTO public.content_relations(source_type,source_id,target_type,target_id,relation_type,status)
SELECT 'game_question',q.id::text,'route',
  CASE
    WHEN lower(q.category) LIKE '%gastronom%' THEN 'ruta6'
    WHEN lower(q.category) LIKE '%naturaleza%' THEN 'ruta4'
    WHEN lower(q.category) LIKE '%literatura%' THEN 'ruta5'
    WHEN lower(q.category) LIKE '%arte%' THEN 'ruta3'
    WHEN lower(q.category) LIKE '%música%' OR lower(q.category) LIKE '%cultura%' THEN 'ruta1'
    ELSE 'ruta2' END,
  'extends_learning','active'
FROM public.game_questions q WHERE q.game_id='81111111-1111-1111-1111-111111111111'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_relations(source_type,source_id,target_type,target_id,relation_type,status)
SELECT 'game_question',q.id::text,'learn_entry',
  CASE
    WHEN lower(coalesce(q.category,'')) LIKE '%música%' OR lower(coalesce(q.category,'')) LIKE '%cultura%' THEN '392e9075-8761-44dd-9df7-496c6d74ad6f'
    WHEN lower(coalesce(q.category,'')) LIKE '%gastronom%' THEN '96173669-c873-4290-8b07-55e88c00d214'
    WHEN lower(coalesce(q.category,'')) LIKE '%leyenda%' THEN '0e7417c8-634d-4d6f-8b8e-0edadec8d00c'
    ELSE NULL END,
  'extends_learning','active'
FROM public.game_questions q
WHERE q.game_id='81111111-1111-1111-1111-111111111111'
  AND (lower(coalesce(q.category,'')) LIKE '%música%' OR lower(coalesce(q.category,'')) LIKE '%cultura%' OR lower(coalesce(q.category,'')) LIKE '%gastronom%' OR lower(coalesce(q.category,'')) LIKE '%leyenda%')
ON CONFLICT DO NOTHING;

INSERT INTO public.content_relations(source_type,source_id,target_type,target_id,relation_type,status)
SELECT 'game_question',q.id::text,'site',s.id,'takes_place_at','active'
FROM public.game_questions q JOIN public.sites s
  ON length(s.nombre)>=6 AND (q.question_text ILIKE '%'||s.nombre||'%' OR coalesce(q.explanation,'') ILIKE '%'||s.nombre||'%')
WHERE q.game_id='81111111-1111-1111-1111-111111111111'
ON CONFLICT DO NOTHING;
