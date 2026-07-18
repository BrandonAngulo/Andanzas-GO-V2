import { useState, useRef, useEffect, useCallback } from 'react';
import { challengeService, DuelPlay, DuelAnswer, DuelRunResult, DuelReview } from '../services/challenge.service';

// Motor del Duelo (modo propio). El set y las reglas vienen congelados del servidor; el
// cliente NO conoce la respuesta correcta (verificación en servidor). Doble reloj EFECTIVO:
// 25s por pregunta + 180s de partida; ambos se pausan al responder (el feedback no cuenta).
// Al terminar (10 respondidas, agotar 180s o abandonar) se envía la corrida completa.

export type DuelPhase = 'playing' | 'submitting' | 'review' | 'error';

export interface DuelEngineState {
    phase: DuelPhase;
    index: number;
    total: number;
    perQMs: number;   // ms restantes de la pregunta actual (25s)
    matchMs: number;  // ms restantes de la partida (180s, presupuesto compartido)
    locked: boolean;  // respuesta registrada: breve confirmación, el reloj está pausado
    selected: string | null;
    result: DuelRunResult | null;
    review: DuelReview | null;
    error: string | null;
}

const TICK = 200;      // resolución del reloj (ms)
const LOCK_MS = 850;   // confirmación breve tras responder (NO cuenta como tiempo efectivo)

export function useDuelEngine(play: DuelPlay) {
    const perQTotal = (play.ruleset?.per_question_seconds ?? 25) * 1000;
    const matchTotal = (play.ruleset?.round_seconds ?? 180) * 1000;
    const questions = play.questions || [];

    const [state, setState] = useState<DuelEngineState>({
        phase: 'playing', index: 0, total: questions.length,
        perQMs: perQTotal, matchMs: matchTotal, locked: false, selected: null,
        result: null, review: null, error: null,
    });

    const answersRef = useRef<DuelAnswer[]>([]);
    const perQRef = useRef(perQTotal);
    const matchRef = useRef(matchTotal);
    const indexRef = useRef(0);
    const lockedRef = useRef(false);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const finishingRef = useRef(false);

    const clearTick = () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };

    const submitRun = useCallback(async () => {
        if (finishingRef.current) return;
        finishingRef.current = true;
        clearTick();
        setState(s => ({ ...s, phase: 'submitting' }));
        try {
            const result = await challengeService.submitDuelRun(play.challenge_id, answersRef.current);
            let review: DuelReview | null = null;
            try { review = await challengeService.getDuelReview(play.challenge_id); } catch { /* review es opcional */ }
            setState(s => ({ ...s, phase: 'review', result, review }));
        } catch (e: any) {
            finishingRef.current = false; // permitir reintento
            setState(s => ({ ...s, phase: 'error', error: e?.message || 'No se pudo enviar el duelo.' }));
        }
    }, [play.challenge_id]);

    const goNext = useCallback(() => {
        const next = indexRef.current + 1;
        if (next >= questions.length || matchRef.current <= 0) { submitRun(); return; }
        indexRef.current = next;
        perQRef.current = perQTotal;
        lockedRef.current = false;
        setState(s => ({ ...s, index: next, perQMs: perQTotal, locked: false, selected: null }));
    }, [questions.length, perQTotal, submitRun]);

    // Registra la respuesta (o null = timeout), pausa el reloj y avanza tras una breve confirmación.
    const selectAnswer = useCallback((selected: string | null) => {
        if (lockedRef.current || finishingRef.current) return;
        lockedRef.current = true;
        clearTick();
        const timeMs = Math.max(0, Math.min(perQTotal - perQRef.current, perQTotal));
        const q = questions[indexRef.current];
        if (q) answersRef.current.push({ question_id: q.id, selected, time_ms: timeMs });
        setState(s => ({ ...s, locked: true, selected }));
        setTimeout(goNext, LOCK_MS);
    }, [perQTotal, questions, goNext]);

    // Relojes: corren solo mientras se juega y la pregunta no está bloqueada.
    useEffect(() => {
        if (state.phase !== 'playing' || state.locked) return;
        clearTick();
        tickRef.current = setInterval(() => {
            perQRef.current -= TICK;
            matchRef.current -= TICK;
            if (matchRef.current <= 0) {
                matchRef.current = 0;
                if (!lockedRef.current) {
                    lockedRef.current = true;
                    const q = questions[indexRef.current];
                    if (q) answersRef.current.push({ question_id: q.id, selected: null, time_ms: Math.max(0, perQTotal - Math.max(perQRef.current, 0)) });
                }
                clearTick();
                setState(s => ({ ...s, matchMs: 0, perQMs: Math.max(perQRef.current, 0) }));
                submitRun();
                return;
            }
            if (perQRef.current <= 0) {
                perQRef.current = 0;
                clearTick();
                setState(s => ({ ...s, perQMs: 0, matchMs: Math.max(matchRef.current, 0) }));
                selectAnswer(null); // se agotó la pregunta => incorrecta, avanza
                return;
            }
            setState(s => ({ ...s, perQMs: Math.max(perQRef.current, 0), matchMs: Math.max(matchRef.current, 0) }));
        }, TICK);
        return clearTick;
    }, [state.phase, state.locked, state.index, questions, perQTotal, selectAnswer, submitRun]);

    useEffect(() => () => clearTick(), []);

    return {
        ...state,
        question: questions[state.index],
        perQTotal, matchTotal,
        selectAnswer,
        retrySubmit: submitRun,
    };
}
