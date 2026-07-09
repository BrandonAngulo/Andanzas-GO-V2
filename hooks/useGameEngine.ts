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

export const useGameEngine = (gameId: string, userId: string | undefined) => {
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

    useEffect(() => {
        if (gameId && userId) {
            initGame();
        }
        return () => stopTimer();
    }, [gameId, userId]);

    useEffect(() => {
        if (state.questions.length > 0 && !state.isFinished && state.currentQuestionIndex < state.questions.length) {
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

        let questions: GameQuestion[] = [];
        if (questionsData && questionsData.length > 0) {
            let finalQuestions = questionsData;

            // Apply Level Distribution logic if defined
            if (game.level_distribution) {
                const dist = game.level_distribution;
                const selected: any[] = [];
                for (let lvl = 1; lvl <= 5; lvl++) {
                    const count = dist[lvl.toString()] || 0;
                    if (count > 0) {
                        const lvlQs = questionsData.filter(q => q.level === lvl);
                        // Shuffle lvlQs
                        const shuffled = [...lvlQs].sort(() => Math.random() - 0.5);
                        selected.push(...shuffled.slice(0, count));
                    }
                }
                // Sort the selected questions by level so it gets progressively harder
                finalQuestions = selected.sort((a, b) => (a.level || 1) - (b.level || 1));
            } else {
                // Classic sort by level
                finalQuestions = questionsData.sort((a, b) => (a.level || 1) - (b.level || 1));
            }

            questions = finalQuestions.map((q: any) => {
                let opts = q.options;
                if (Array.isArray(opts)) {
                    // Randomize options for multiple choice
                    opts = [...opts].sort(() => Math.random() - 0.5);
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

    const submitAnswer = async (selectedAnswer: any, isTimeout: boolean = false) => {
        stopTimer();
        const timeToAnswerMs = Date.now() - questionStartTimeRef.current;
        const currentQ = state.questions[state.currentQuestionIndex];
        
        // Ensure accurate comparison handling depending on type
        // Assume multiple choice string comparison for now
        const isCorrect = state.game?.type === 'quiz' ? true : (!isTimeout && selectedAnswer === currentQ.correct_answer);
        
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

            // Time bonus (faster = more points) if enabled
            if (state.game?.bonus_time_enabled && timeToAnswerMs < (currentQ.time_limit_sec * 1000) / 2) {
                timeBonus = 20;
                pointsEarned += timeBonus;
            }
        }

        // Save to DB
        if (state.sessionId) {
            await supabase.from('game_answers').insert({
                session_id: state.sessionId,
                question_id: currentQ.id,
                is_correct: isCorrect,
                time_to_answer_ms: timeToAnswerMs,
                selected_answer: selectedAnswer,
                correct_answer_snapshot: currentQ.correct_answer,
                question_snapshot: currentQ,
                points_possible: currentQ.points_reward,
                points_earned: pointsEarned,
                streak_bonus_points: streakBonus,
                time_bonus_points: timeBonus,
                timed_out: isTimeout
            });
        }

        let isGameEnding = false;
        let finalLives = state.livesRemaining;

        if (!isCorrect) {
            if (state.game?.mechanic_type === 'sudden_death') {
                isGameEnding = true;
            } else if (state.game?.mechanic_type === 'lives') {
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

        if (isGameEnding) {
            // Need to save first then finish
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
        
        // Calculate final stats
        const { data: answers } = await supabase
            .from('game_answers')
            .select('is_correct, points_earned')
            .eq('session_id', state.sessionId);

        let correctCount = 0;
        let finalScore = state.score;
        let answeredCount = 0;

        if (answers) {
            let answersToCount = answers;
            if (isAborted && (!state.game?.mechanic_type || state.game?.mechanic_type === 'safe_zones')) {
                const safeZoneCount = Math.floor((state.currentQuestionIndex) / 5) * 5;
                answersToCount = answers.slice(0, safeZoneCount);
            }

            answeredCount = answersToCount.length;
            correctCount = answersToCount.filter(a => a.is_correct).length;
            finalScore = answersToCount.reduce((sum, a) => sum + (a.points_earned || 0), 0);
        }

        const accuracy = state.questions.length > 0 ? (correctCount / state.questions.length) * 100 : 0;

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
