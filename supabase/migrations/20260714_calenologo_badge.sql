-- Insignia "Caleñólogo": se desbloquea al descubrir la Palabra del día 7 días.
-- Actualiza claim_word_of_the_day para otorgarla server-side (atómico). Idempotente.
INSERT INTO public.badges (id, nombre, nombre_en, descripcion, descripcion_en, icono_name, image_url, family_key, tier)
VALUES ('badge-calenologo', 'Caleñólogo', 'Caleñólogo',
        'Descubriste la Palabra del día durante 7 días. ¡Ya hablás como caleño de pura cepa!',
        'You discovered the Word of the Day for 7 days.',
        'Feather', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

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
    new_total INTEGER;
    pts INTEGER;
    badge_unlocked BOOLEAN := false;
BEGIN
    IF uid IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
    END IF;

    SELECT * INTO rec FROM public.user_word_of_day WHERE user_id = uid;

    IF FOUND AND rec.last_claim_date = today THEN
        RETURN jsonb_build_object('ok', true, 'already_claimed', true, 'awarded_points', 0,
                                  'streak', rec.current_streak, 'best_streak', rec.best_streak,
                                  'badge_unlocked', false);
    END IF;

    IF FOUND AND rec.last_claim_date = today - 1 THEN
        new_streak := rec.current_streak + 1;
    ELSE
        new_streak := 1;
    END IF;

    new_total := COALESCE(rec.total_claims, 0) + 1;
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

    IF new_total >= 7 THEN
        INSERT INTO public.user_badges (user_id, badge_id)
        SELECT uid, 'badge-calenologo'
        WHERE NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = uid AND badge_id = 'badge-calenologo');
        IF FOUND THEN badge_unlocked := true; END IF;
    END IF;

    RETURN jsonb_build_object('ok', true, 'already_claimed', false, 'awarded_points', pts,
                              'streak', new_streak, 'best_streak', GREATEST(COALESCE(rec.best_streak, 0), new_streak),
                              'total_claims', new_total,
                              'badge_unlocked', badge_unlocked,
                              'badge_name', CASE WHEN badge_unlocked THEN 'Caleñólogo' ELSE NULL END);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.claim_word_of_the_day() TO authenticated;
