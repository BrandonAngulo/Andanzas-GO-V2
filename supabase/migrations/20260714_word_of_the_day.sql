-- Racha de "Palabra del día" del diccionario. Una reclamación por usuario por día;
-- otorga puntos vía award_points y lleva la racha de días consecutivos. Idempotente.
CREATE TABLE IF NOT EXISTS public.user_word_of_day (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    last_claim_date DATE NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    total_claims INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_word_of_day ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "word_of_day_select_own" ON public.user_word_of_day;
CREATE POLICY "word_of_day_select_own" ON public.user_word_of_day
    FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.claim_word_of_the_day()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    uid UUID := auth.uid();
    today DATE := timezone('utc'::text, now())::date;
    rec public.user_word_of_day%ROWTYPE;
    new_streak INTEGER;
    pts INTEGER;
BEGIN
    IF uid IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
    END IF;

    SELECT * INTO rec FROM public.user_word_of_day WHERE user_id = uid;

    IF FOUND AND rec.last_claim_date = today THEN
        RETURN jsonb_build_object('ok', true, 'already_claimed', true, 'awarded_points', 0,
                                  'streak', rec.current_streak, 'best_streak', rec.best_streak);
    END IF;

    IF FOUND AND rec.last_claim_date = today - 1 THEN
        new_streak := rec.current_streak + 1;
    ELSE
        new_streak := 1;
    END IF;

    pts := 10 + LEAST(new_streak - 1, 10);

    INSERT INTO public.user_word_of_day (user_id, last_claim_date, current_streak, best_streak, total_claims, updated_at)
    VALUES (uid, today, new_streak, new_streak, 1, timezone('utc'::text, now()))
    ON CONFLICT (user_id) DO UPDATE
        SET last_claim_date = today,
            current_streak = new_streak,
            best_streak = GREATEST(public.user_word_of_day.best_streak, new_streak),
            total_claims = public.user_word_of_day.total_claims + 1,
            updated_at = timezone('utc'::text, now());

    PERFORM public.award_points(pts, 'Palabra del día');

    RETURN jsonb_build_object('ok', true, 'already_claimed', false, 'awarded_points', pts,
                              'streak', new_streak, 'best_streak', GREATEST(COALESCE(rec.best_streak, 0), new_streak));
END;
$function$;

GRANT EXECUTE ON FUNCTION public.claim_word_of_the_day() TO authenticated;
