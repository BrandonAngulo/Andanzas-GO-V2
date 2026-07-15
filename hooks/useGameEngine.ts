import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Game, GameQuestion, gamesService } from '../services/games.service';

export interface GameEngineState {
    game: Game | null;
    questions: GameQuestion[];
    currentQuestionIndex: number;
    score: number;
    accuracyPercent: number;
    streak: number;
    maxStreak: number;
    isFinished: boolean;
    loading: boolean;
    error: string | null;
    sessionId: string | null;
    timeRemaining: number;
    totalTimeMs: number;
    livesRemaining: number;
    userAnswers: { questionId: string; isCorrect: boolean; category: string }[];
    bestCategory: string | null;
    worstCategory: string | null;
}

// Verifica si una respuesta es correcta según el tipo de pregunta.
// Cada tipo tiene una forma distinta de 'options'/'correct_answer' (ver services/games.service.ts).
export const checkAnswerCorrectness = (question: GameQuestion, selectedAnswer: any): boolean => {
    if (selectedAnswer === null || selectedAnswer === undefined) return false;

    switch (question.question_type) {
        case 'multi_select': {
            const correct: string[] = Array.isArray(question.correct_answer) ? question.correct_answer : [];
            const chosen: string[] = Array.isArray(selectedAnswer) ? selectedAnswer : [];
            if (correct.length === 0 || correct.length !== chosen.length) return false;
            const sortedCorrect = [...correct].sort();
            const sortedChosen = [...chosen].sort();
            return sortedCorrect.every((v, i) => v === sortedChosen[i]);
        }
        case 'ordering': {
            const correct: string[] = Array.isArray(question.correct_answer) ? question.correct_answer : [];
            const chosen: string[] = Array.isArray(selectedAnswer) ? selectedAnswer : [];
            if (correct.length === 0 || correct.length !== chosen.length) return false;
            return correct.every((v, i) => v === chosen[i]);
        }
        case 'matching': {
            const correct: Record<string, string> = (question.correct_answer && typeof question.correct_answer === 'object') ? question.correct_answer : {};
            const chosen: Record<string, string> = (selectedAnswer && typeof selectedAnswer === 'object') ? selectedAnswer : {};
            const keys = Object.keys(correct);
            if (keys.length === 0) return false;
            return keys.every(k => correct[k] === chosen[k]);
        }
        case 'image_choice':
        case 'multiple_choice':
        default:
            return selectedAnswer === question.correct_answer;
    }
};

// Segundos totales de una ronda Contrarreloj (15 preguntas contra un solo reloj).
export const TIMED_ROUND_SECONDS = 120;

export const useGameEngine = (gameId: string, userId: string | undefined, mode: 'levels' | 'legend' | 'timed' = 'levels', theme?: string) => {
    const [state, setState] = useState<GameEngineState>({
        game: null,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        accuracyPercent: 0,
        streak: 0,
        maxStreak: 0,
        isFinished: false,
        loading: true,
        error: null,
        sessionId: null,
        timeRemaining: 30,
        totalTimeMs: 0,
        livesRemaining: 3,
        userAnswers: [],
        bestCategory: null,
        worstCategory: null
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const questionStartTimeRef = useRef<number>(0);
    // Modo activo (levels = corto por niveles; legend = sin fin con vidas; timed = contrarreloj).
    const modeRef = useRef<'levels' | 'legend' | 'timed'>(mode);
    modeRef.current = mode;
    const globalTimerStartedRef = useRef(false);
    const finishedRef = useRef(false); // evita finalizar la partida dos veces (p. ej. reloj + acción del usuario)

    useEffect(() => {
        if (gameId && userId) {
            initGame();
        }
        return () => stopTimer();
    }, [gameId, userId, mode, theme]);

    // Contrarreloj: un único cronómetro global para toda la ronda.
    useEffect(() => {
        if (mode === 'timed' && state.sessionId && state.questions.length > 0 && !globalTimerStartedRef.current && !state.isFinished) {
            globalTimerStartedRef.current = true;
            startGlobalTimer(TIMED_ROUND_SECONDS);
        }
    }, [mode, state.sessionId, state.questions.length, state.isFinished]);

    useEffect(() => {
        if (state.questions.length > 0 && !state.isFinished && state.currentQuestionIndex < state.questions.length) {
            // En Contrarreloj el reloj es global (no se reinicia por pregunta).
            if (mode === 'timed') {
                questionStartTimeRef.current = Date.now();
                return;
            }
            startTimer(state.questions[state.currentQuestionIndex].time_limit_sec || 30);
        }
    }, [state.currentQuestionIndex, state.questions, state.isFinished]);

    const initGame = async () => {
        try {
            const game = await gamesService.getGameById(gameId);
            if (!game) throw new Error("Juego no encontrado");

            // Create a session in DB
            let { data: questionsData, error: qError } = await supabase
            .from('game_questions')
            .select('*')
            .eq('game_id', gameId)
            .eq('status', 'published');

        if (qError) {
            console.error('Error cargando preguntas:', qError);
            setState(prev => ({ ...prev, loading: false }));
            return;
        }

        // Antirrepetición básica: preguntas que este usuario ya respondió en sus últimas
        // partidas de este juego, para preferir contenido no visto al componer la partida.
        let recentlySeen = new Set<string>();
        if (userId) {
            const { data: recentSessions } = await supabase
                .from('game_sessions')
                .select('id')
                .eq('user_id', userId)
                .eq('game_id', gameId)
                .order('started_at', { ascending: false })
                .limit(30);
            const sessionIds = (recentSessions || []).map((s: any) => s.id);
            if (sessionIds.length > 0) {
                const { data: seen } = await supabase
                    .from('game_answers')
                    .select('question_id')
                    .in('session_id', sessionIds)
                    .limit(500);
                recentlySeen = new Set((seen || []).map((r: any) => r.question_id).filter(Boolean));
            }
        }

        // Piso de dificultad según la experiencia del jugador (nivel del perfil): a mayor
        // nivel, se saltan los niveles más fáciles. Conservador (máx. 3) para no agotar el banco.
        let difficultyFloor = 1;
        if (userId) {
            const { data: prof } = await supabase.from('profiles').select('level').eq('id', userId).maybeSingle();
            const userLevel = (prof?.level as number) || 1;
            difficultyFloor = Math.min(1 + Math.floor(Math.max(0, userLevel - 1) / 3), 3);
        }

        let questions: GameQuestion[] = [];
        if (questionsData && questionsData.length > 0) {
            // Filtro por tema: sin tema ('Todo') usa solo el núcleo del juego (sin campaña);
            // un tema específico usa esa categoría (incluye campañas como Vocabulario).
            const activeTheme = (theme && theme !== 'all') ? theme : null;
            const themed = activeTheme
                ? questionsData.filter(q => q.category === activeTheme)
                : questionsData.filter(q => !(q as any).campaign);
            const source = themed.length > 0 ? themed : questionsData; // salvaguarda: nunca dejar la partida vacía

            // Ordena una lista poniendo primero las no vistas recientemente (cada grupo barajado).
            const freshFirst = (arr: any[]) => {
                const unseen = arr.filter(q => !recentlySeen.has(q.id));
                const seen = arr.filter(q => recentlySeen.has(q.id));
                const sh = (a: any[]) => [...a].sort(() => Math.random() - 0.5);
                return [...sh(unseen), ...sh(seen)];
            };

            // Cola de dificultad ASCENDENTE para Modo Leyenda: arranca en 'floor' (experiencia)
            // y sube el techo cada pocas preguntas, sirviendo el nivel más alto disponible de la
            // ventana. Así no se vuelca lo fácil al principio: la dificultad trepa rápido y se
            // sostiene arriba (y recicla lo más difícil cuando se agota).
            const buildRampQueue = (pool: any[], floor: number) => {
                const byLevel: Record<number, any[]> = {};
                for (const q of pool) { const lv = Math.min(Math.max(q.level || 1, 1), 5); (byLevel[lv] = byLevel[lv] || []).push(q); }
                for (let lv = 1; lv <= 5; lv++) if (byLevel[lv]) byLevel[lv] = freshFirst(byLevel[lv]);
                const cursor: Record<number, number> = {};
                const availAt = (lv: number) => (byLevel[lv]?.length || 0) - (cursor[lv] || 0);
                const takeFrom = (lv: number) => { const i = cursor[lv] || 0; cursor[lv] = i + 1; return byLevel[lv][i]; };
                const queue: any[] = [];
                while (queue.length < pool.length) {
                    const cap = Math.min(5, floor + Math.floor(queue.length / 4)); // el techo sube cada 4
                    let placed = false;
                    for (let lv = cap; lv >= floor; lv--) { if (availAt(lv) > 0) { queue.push(takeFrom(lv)); placed = true; break; } }
                    if (!placed) { // agotada la ventana [floor, cap]: toma cualquier nivel restante (prefiere difícil)
                        for (let lv = 5; lv >= 1; lv--) { if (availAt(lv) > 0) { queue.push(takeFrom(lv)); placed = true; break; } }
                    }
                    if (!placed) break;
                }
                return queue;
            };

            const groupByLevelShuffled = (arr: any[]) => {
                const byLevel: Record<number, any[]> = {};
                for (const q of arr) { const lv = q.level || 1; (byLevel[lv] = byLevel[lv] || []).push(q); }
                const ordered: any[] = [];
                Object.keys(byLevel).map(Number).sort((a, b) => a - b).forEach(lv => {
                    ordered.push(...freshFirst(byLevel[lv]));
                });
                return ordered;
            };

            let finalQuestions = source;

            if (mode === 'legend') {
                // Modo Leyenda: pool completo con dificultad ascendente (piso según experiencia),
                // sin tope. La partida sigue mientras queden vidas.
                finalQuestions = buildRampQueue(source, difficultyFloor);
            } else if (activeTheme) {
                // Tema específico (corto): hasta questions_per_match, dificultad ascendente.
                const qpm = game.questions_per_match || 15;
                finalQuestions = groupByLevelShuffled(source).slice(0, qpm);
            } else if (game.level_distribution) {
                const dist = game.level_distribution;
                const selected: any[] = [];
                for (let lvl = 1; lvl <= 5; lvl++) {
                    const count = dist[lvl.toString()] || 0;
                    if (count > 0) {
                        const lvlQs = source.filter(q => q.level === lvl);
                        const shuffled = freshFirst(lvlQs); // preferir no vistas recientemente
                        selected.push(...shuffled.slice(0, count));
                    }
                }
                // Progresivo por nivel.
                finalQuestions = selected.sort((a, b) => (a.level || 1) - (b.level || 1));
            } else {
                // Sin distribución por nivel: respeta questions_per_match (antes cargaba TODO el banco).
                const qpm = game.questions_per_match || 15;
                finalQuestions = [...source].sort((a, b) => (a.level || 1) - (b.level || 1)).slice(0, qpm);
            }

            questions = finalQuestions.map((q: any) => {
                let opts = q.options;
                if (Array.isArray(opts)) {
                    // Aleatoriza el orden de presentación (multiple_choice, multi_select, ordering, image_choice)
                    opts = [...opts].sort(() => Math.random() - 0.5);
                } else if (opts && typeof opts === 'object' && Array.isArray(opts.right)) {
                    // Tipo 'matching': solo se aleatoriza la columna derecha, la izquierda mantiene su orden de lectura
                    opts = { ...opts, right: [...opts.right].sort(() => Math.random() - 0.5) };
                }
                return { ...q, options: opts };
            }) as GameQuestion[];
        }

            if (questions.length === 0) throw new Error("El juego no tiene preguntas");

            const { data: sessionData, error: sessionError } = await supabase
                .from('game_sessions')
                .insert({
                    game_id: gameId,
                    user_id: userId,
                    total_questions: questions.length
                })
                .select()
                .single();

            if (sessionError) throw sessionError;

            setState(prev => ({
                ...prev,
                game,
                questions,
                sessionId: sessionData.id,
                livesRemaining: game.lives_count || 3,
                loading: false
            }));

        } catch (err: any) {
            setState(prev => ({ ...prev, loading: false, error: err.message }));
        }
    };

    const startTimer = (seconds: number) => {
        stopTimer();
        questionStartTimeRef.current = Date.now();
        setState(prev => ({ ...prev, timeRemaining: seconds }));
        
        timerRef.current = setInterval(() => {
            setState(prev => {
                if (prev.timeRemaining <= 1) {
                    stopTimer();
                    handleTimeOut();
                    return { ...prev, timeRemaining: 0 };
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleTimeOut = () => {
        // Force answer with empty value if timeout
        submitAnswer(null, true);
    };

    // Contrarreloj: un solo cronómetro para toda la ronda. Al llegar a 0, termina la ronda.
    const startGlobalTimer = (seconds: number) => {
        stopTimer();
        questionStartTimeRef.current = Date.now();
        setState(prev => ({ ...prev, timeRemaining: seconds }));
        timerRef.current = setInterval(() => {
            setState(prev => {
                if (prev.timeRemaining <= 1) {
                    stopTimer();
                    finishGame(true);
                    return { ...prev, timeRemaining: 0 };
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000);
    };

    const submitAnswer = async (selectedAnswer: any, isTimeout: boolean = false) => {
        // En Contrarreloj el reloj es global y no se detiene entre preguntas.
        if (modeRef.current !== 'timed') stopTimer();
        const timeToAnswerMs = Date.now() - questionStartTimeRef.current;
        const currentQ = state.questions[state.currentQuestionIndex];
        
        // El tipo 'quiz' (encuesta/consulta de opinión) no tiene respuesta correcta/incorrecta.
        // Para el resto, la verificación depende del tipo de pregunta (ver checkAnswerCorrectness).
        const isCorrect = state.game?.type === 'quiz' ? true : (!isTimeout && checkAnswerCorrectness(currentQ, selectedAnswer));
        
        let pointsEarned = 0;
        let newStreak = isCorrect ? state.streak + 1 : 0;
        let streakBonus = 0;
        let timeBonus = 0;

        if (isCorrect) {
            pointsEarned = currentQ.points_reward;
            
            if (state.game?.mechanic_type === 'multiplier') {
                const multiplier = Math.min(newStreak, 5); // Up to 5x
                pointsEarned = pointsEarned * multiplier;
            } else {
                // Classic streak bonus
                if (newStreak >= 3) {
                    streakBonus = Math.min(newStreak * 10, 50); // Cap at 50
                    pointsEarned += streakBonus;
                }
            }

            // Time bonus (faster = more points) if enabled. En Contrarreloj no aplica: el
            // premio es el x2 al completar, no bonos por pregunta.
            if (modeRef.current !== 'timed' && state.game?.bonus_time_enabled && timeToAnswerMs < (currentQ.time_limit_sec * 1000) / 2) {
                timeBonus = 20;
                pointsEarned += timeBonus;
            }
        }

        // Save to DB
        if (state.sessionId) {
            await supabase.from('game_answers').insert({
                session_id: state.sessionId,
                question_id: currentQ.id,
                question_order: state.currentQuestionIndex, // orden explícito (para cortes por zona segura)
                is_correct: isCorrect,
                time_to_answer_ms: timeToAnswerMs,
                selected_answer: selectedAnswer,
                correct_answer_snapshot: currentQ.correct_answer,
                // Snapshot ligero: solo lo que consume la analítica. Evita copiar opciones/explicación
                // completas por cada respuesta de cada jugador (ahorro de memoria a escala).
                question_snapshot: { id: currentQ.id, question_text: currentQ.question_text, category: currentQ.category },
                points_possible: currentQ.points_reward,
                points_earned: pointsEarned,
                streak_bonus_points: streakBonus,
                time_bonus_points: timeBonus,
                timed_out: isTimeout
            });
        }

        let isGameEnding = false;
        let finalLives = state.livesRemaining;

        // Mecánica efectiva: Leyenda = vidas; Contrarreloj = un fallo termina la ronda.
        const effectiveMechanic = modeRef.current === 'legend' ? 'lives'
            : modeRef.current === 'timed' ? 'sudden_death'
            : state.game?.mechanic_type;
        if (!isCorrect) {
            if (effectiveMechanic === 'sudden_death') {
                isGameEnding = true;
            } else if (effectiveMechanic === 'lives') {
                finalLives = state.livesRemaining - 1;
                if (finalLives <= 0) {
                    isGameEnding = true;
                }
            }
        }

        setState(prev => ({
            ...prev,
            score: prev.score + pointsEarned,
            streak: newStreak,
            maxStreak: Math.max(prev.maxStreak, newStreak),
            totalTimeMs: prev.totalTimeMs + timeToAnswerMs,
            livesRemaining: finalLives,
            userAnswers: [...prev.userAnswers, { questionId: currentQ.id, isCorrect, category: currentQ.category || 'General' }]
        }));

        // Si la ronda termina por este fallo, detenemos el reloj (relevante en Contrarreloj,
        // cuyo cronómetro global sigue corriendo durante la retroalimentación).
        if (isGameEnding) {
            stopTimer();
        }

        return isCorrect;
    };

    const nextQuestion = async () => {
        const nextIdx = state.currentQuestionIndex + 1;
        if (nextIdx >= state.questions.length) {
            await finishGame();
        } else {
            setState(prev => ({ ...prev, currentQuestionIndex: nextIdx }));
        }
    };

    const finishGame = async (isAborted: boolean = false) => {
        if (!state.sessionId) return;
        if (finishedRef.current) return; // ya se finalizó (evita doble conteo de puntos)
        finishedRef.current = true;
        stopTimer(); // detiene el reloj (global en Contrarreloj) al cerrar la ronda

        // Calculate final stats. Orden explícito por question_order: el corte por zona
        // segura (slice) depende del orden cronológico real, no del orden de la BD.
        const { data: answers } = await supabase
            .from('game_answers')
            .select('is_correct, points_earned, streak_bonus_points, question_order')
            .order('question_order', { ascending: true, nullsFirst: true })
            .eq('session_id', state.sessionId);

        let correctCount = 0;
        let finalScore = state.score;
        let answeredCount = 0;

        if (modeRef.current === 'timed' && answers) {
            // Contrarreloj: puntuación por tramos según hasta dónde se llegó, y x2 al completar.
            const total = state.questions.length; // 15
            const correct = answers.filter(a => a.is_correct);
            const racha = correct.reduce((s, a) => s + (a.streak_bonus_points || 0), 0);
            const base = correct.reduce((s, a) => s + ((a.points_earned || 0) - (a.streak_bonus_points || 0)), 0);
            const reached = answers.length;
            const completed = correct.length >= total; // las 15 correctas
            if (completed) finalScore = (base + racha) * 2;        // ✔ completó → doble
            else if (reached >= 11) finalScore = base + racha;     // 11–14 → racha asegurada
            else finalScore = base;                                // 1–10 → solo base
            answeredCount = reached;
            correctCount = correct.length;
        } else if (answers) {
            let answersToCount = answers;
            if (isAborted && (!state.game?.mechanic_type || state.game?.mechanic_type === 'safe_zones')) {
                const safeZoneCount = Math.floor((state.currentQuestionIndex) / 5) * 5;
                answersToCount = answers.slice(0, safeZoneCount);
            }

            answeredCount = answersToCount.length;
            correctCount = answersToCount.filter(a => a.is_correct).length;
            finalScore = answersToCount.reduce((sum, a) => sum + (a.points_earned || 0), 0);
        }

        const accuracy = answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;

        // Calculate categories
        const categoryStats = state.userAnswers.reduce((acc, curr) => {
            if (!acc[curr.category]) acc[curr.category] = { correct: 0, total: 0 };
            acc[curr.category].total++;
            if (curr.isCorrect) acc[curr.category].correct++;
            return acc;
        }, {} as Record<string, {correct: number, total: number}>);

        let bestCategory: string | null = null;
        let worstCategory: string | null = null;
        let bestScore = -1;
        let worstScore = 2; 

        Object.entries(categoryStats).forEach(([cat, stats]) => {
            const ratio = stats.correct / stats.total;
            if (ratio > bestScore) {
                bestScore = ratio;
                bestCategory = cat;
            }
            if (ratio < worstScore && ratio < 1) { // Only count as worst if they actually missed something
                worstScore = ratio;
                worstCategory = cat;
            }
        });
        
        // Prevent showing the same category as best and worst
        if (bestCategory === worstCategory) {
            worstCategory = null;
        }

        await supabase.from('game_sessions').update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            total_score: finalScore,
            accuracy_percent: accuracy,
            answered_questions: answeredCount,
            correct_answers: correctCount,
            total_time_ms: state.totalTimeMs,
            max_correct_streak: state.maxStreak
        }).eq('id', state.sessionId);

        // Award global points
        await supabase.rpc('award_points', {
            points_to_add: finalScore,
            reason_text: `Trivia: ${state.game?.title}`
        });

        setState(prev => ({
            ...prev,
            isFinished: true,
            accuracyPercent: accuracy,
            score: finalScore,
            bestCategory,
            worstCategory
        }));
    };

    return {
        ...state,
        submitAnswer,
        nextQuestion,
        finishGame,
        currentQuestion: state.questions[state.currentQuestionIndex]
    };
};
