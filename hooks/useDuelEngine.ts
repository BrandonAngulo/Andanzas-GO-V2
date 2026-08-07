import { useCallback, useEffect, useRef, useState } from 'react';
import { challengeService, type DuelAnswer, type DuelPlay, type DuelReview, type DuelRunResult } from '../services/challenge.service';

// El set y las reglas vienen congelados del servidor. El cliente nunca recibe la
// respuesta correcta antes de enviar la corrida. Hay un reloj por pregunta y otro global;
// agotar cualquiera termina la corrida y el servidor la registra como derrota por tiempo.

export type DuelPhase = 'playing' | 'submitting' | 'review' | 'error';
export type DuelEndReason = 'question_timeout' | 'round_timeout' | 'abandoned' | null;

export interface DuelEngineState {
    phase: DuelPhase;
    index: number;
    total: number;
    perQMs: number;
    matchMs: number;
    locked: boolean;
    selected: string | null;
    result: DuelRunResult | null;
    review: DuelReview | null;
    error: string | null;
    endReason: DuelEndReason;
}

const TICK = 200;
const LOCK_MS = 850;

export function useDuelEngine(play: DuelPlay) {
    const perQTotal = (play.ruleset?.per_question_seconds ?? 25) * 1000;
    const matchTotal = (play.ruleset?.round_seconds ?? 180) * 1000;
    const questions = play.questions || [];

    const [state, setState] = useState<DuelEngineState>({
        phase: 'playing',
        index: 0,
        total: questions.length,
        perQMs: perQTotal,
        matchMs: matchTotal,
        locked: false,
        selected: null,
        result: null,
        review: null,
        error: null,
        endReason: null,
    });

    const answersRef = useRef<DuelAnswer[]>([]);
    const perQRef = useRef(perQTotal);
    const matchRef = useRef(matchTotal);
    const indexRef = useRef(0);
    const lockedRef = useRef(false);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const finishingRef = useRef(false);

    const clearTick = useCallback(() => {
        if (tickRef.current) {
            clearInterval(tickRef.current);
            tickRef.current = null;
        }
    }, []);
    const clearTransition = useCallback(() => {
        if (transitionRef.current) {
            clearTimeout(transitionRef.current);
            transitionRef.current = null;
        }
    }, []);

    const submitRun = useCallback(async () => {
        if (finishingRef.current) return;
        finishingRef.current = true;
        clearTick();
        clearTransition();
        setState(current => ({ ...current, phase: 'submitting' }));
        try {
            const result = await challengeService.submitDuelRun(play.challenge_id, answersRef.current);
            let review: DuelReview | null = null;
            try {
                review = await challengeService.getDuelReview(play.challenge_id);
            } catch {
                // El repaso es complementario; el resultado autoritativo ya quedó registrado.
            }
            setState(current => ({ ...current, phase: 'review', result, review }));
        } catch (error: any) {
            finishingRef.current = false;
            setState(current => ({ ...current, phase: 'error', error: error?.message || 'No se pudo enviar el duelo.' }));
        }
    }, [clearTick, clearTransition, play.challenge_id]);

    const goNext = useCallback(() => {
        const next = indexRef.current + 1;
        if (next >= questions.length || matchRef.current <= 0) {
            void submitRun();
            return;
        }
        indexRef.current = next;
        perQRef.current = perQTotal;
        lockedRef.current = false;
        setState(current => ({ ...current, index: next, perQMs: perQTotal, locked: false, selected: null }));
    }, [perQTotal, questions.length, submitRun]);

    const selectAnswer = useCallback((selected: string) => {
        if (lockedRef.current || finishingRef.current) return;
        lockedRef.current = true;
        clearTick();
        const timeMs = Math.max(0, Math.min(perQTotal - perQRef.current, perQTotal));
        const question = questions[indexRef.current];
        if (question) answersRef.current.push({ question_id: question.id, selected, time_ms: timeMs });
        setState(current => ({ ...current, locked: true, selected }));
        transitionRef.current = setTimeout(goNext, LOCK_MS);
    }, [clearTick, goNext, perQTotal, questions]);

    const endRun = useCallback((reason: Exclude<DuelEndReason, null>) => {
        if (finishingRef.current || (lockedRef.current && reason !== 'abandoned')) return;
        lockedRef.current = true;
        clearTick();
        clearTransition();
        const question = questions[indexRef.current];
        const timeMs = reason === 'question_timeout'
            ? perQTotal
            : Math.max(0, Math.min(perQTotal - Math.max(perQRef.current, 0), perQTotal));
        const alreadyAnswered = question && answersRef.current.some(answer => answer.question_id === question.id);
        if (question && !alreadyAnswered) answersRef.current.push({ question_id: question.id, selected: null, time_ms: timeMs, forfeited: true });
        setState(current => ({
            ...current,
            locked: true,
            selected: null,
            perQMs: Math.max(perQRef.current, 0),
            matchMs: Math.max(matchRef.current, 0),
            endReason: reason,
        }));
        transitionRef.current = setTimeout(() => { void submitRun(); }, LOCK_MS);
    }, [clearTick, clearTransition, perQTotal, questions, submitRun]);

    useEffect(() => {
        if (state.phase !== 'playing' || state.locked) return;
        clearTick();
        tickRef.current = setInterval(() => {
            perQRef.current -= TICK;
            matchRef.current -= TICK;

            if (matchRef.current <= 0) {
                matchRef.current = 0;
                endRun('round_timeout');
                return;
            }
            if (perQRef.current <= 0) {
                perQRef.current = 0;
                endRun('question_timeout');
                return;
            }
            setState(current => ({
                ...current,
                perQMs: Math.max(perQRef.current, 0),
                matchMs: Math.max(matchRef.current, 0),
            }));
        }, TICK);
        return clearTick;
    }, [clearTick, endRun, state.index, state.locked, state.phase]);

    useEffect(() => () => {
        clearTick();
        clearTransition();
    }, [clearTick, clearTransition]);

    return {
        ...state,
        question: questions[state.index],
        perQTotal,
        matchTotal,
        selectAnswer,
        forfeit: () => endRun('abandoned'),
        retrySubmit: submitRun,
    };
}
