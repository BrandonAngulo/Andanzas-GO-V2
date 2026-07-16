import React, { useState } from 'react';
import { useGameEngine, checkAnswerCorrectness, TIMED_ROUND_SECONDS } from '../../hooks/useGameEngine';
import { Button } from '../ui/button';
import { X, CheckCircle2, XCircle, Trophy, Flame, Clock, Star, Users, Heart, Target, Flag, RotateCcw } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { gamesService } from '../../services/games.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../../contexts/UserDataContext';
import { toast } from 'sonner';
import { challengeService } from '../../services/challenge.service';
import { QuestionRenderer } from './QuestionRenderer';
import { GameMascot, MascotState } from './GameMascot';
import ReactConfetti from 'react-confetti';
import { dictionaryService } from '../../services/dictionary.service';
import { DictionaryDetail } from '../dictionary/DictionaryDetail';
import { TextWithDictionaryLinks } from '../shared/TextWithDictionaryLinks';
import type { DictionaryEntry } from '../../types';

interface GameSessionModalProps {
    gameId: string;
    onClose: () => void;
    onNavigate?: (panel: string) => void;
    onRetry?: () => void;
    challengeId?: string;
    mode?: 'levels' | 'legend' | 'timed';
    theme?: string;
}

export const GameSessionModal: React.FC<GameSessionModalProps> = ({ gameId, onClose, onNavigate, onRetry, challengeId, mode = 'levels', theme }) => {
    const isLegend = mode === 'legend';
    const isTimed = mode === 'timed';
    const { userProfile } = useUserData();
    const {
        game,
        questions,
        currentQuestion,
        currentQuestionIndex,
        score,
        streak,
        isFinished,
        loading,
        error,
        timeRemaining,
        submitAnswer,
        nextQuestion,
        finishGame,
        accuracyPercent,
        bestCategory,
        worstCategory,
        categoryProgress,
        sessionId,
        livesRemaining
    } = useGameEngine(gameId, userProfile?.id, mode, theme);

    const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);

    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const [isReporting, setIsReporting] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);
    
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [hasTimedOut, setHasTimedOut] = useState(false);

    const [isShuffling, setIsShuffling] = useState(false);
    const [shuffledCategory, setShuffledCategory] = useState("Salsa");
    // Categorías reales del banco cargado (para la animación de mezcla); respaldo si aún no hay preguntas.
    const categories = (() => {
        const fromQuestions = Array.from(new Set(questions.map(q => q.category).filter(Boolean))) as string[];
        return fromQuestions.length > 0 ? fromQuestions : ["Historia", "Arte", "Salsa", "Naturaleza", "Gastronomía", "Literatura", "General"];
    })();
    const [streakBurst, setStreakBurst] = useState(false);

    // Términos del diccionario para auto-enlazar en la retroalimentación de cada pregunta.
    const [dictEntries, setDictEntries] = useState<DictionaryEntry[]>([]);
    const [dictSelected, setDictSelected] = useState<DictionaryEntry | null>(null);
    React.useEffect(() => {
        let active = true;
        dictionaryService.listPublishedForLinking().then((e) => { if (active) setDictEntries(e); }).catch(() => undefined);
        return () => { active = false; };
    }, []);

    // Reacción visual de la mascota del juego según el estado de la pregunta actual
    const mascotState: MascotState = !isChecking ? 'idle' : (game?.type === 'quiz' ? 'idle' : (isCorrect ? 'correct' : 'wrong'));

    // Ráfaga de confeti al alcanzar una racha importante (cada 3 respuestas correctas seguidas)
    React.useEffect(() => {
        if (isChecking && isCorrect && streak > 0 && streak % 3 === 0) {
            setStreakBurst(true);
            const t = setTimeout(() => setStreakBurst(false), 1600);
            return () => clearTimeout(t);
        }
    }, [isChecking, isCorrect, streak]);

    React.useEffect(() => {
        if (isFinished && challengeId && sessionId) {
            challengeService.completeChallenge(challengeId, sessionId, null).then(() => {
                // El router de la app lee window.location.hash (ver App.tsx parseHash/pushHash),
                // no la ruta de la URL, así que la navegación al veredicto debe ir por hash.
                window.location.hash = `#/challenge/${challengeId}/verdict`;
            });
        }
    }, [isFinished, challengeId, sessionId]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (!isFinished && !loading && !error && !showExitConfirm) {
                    setShowExitConfirm(true);
                } else if (showExitConfirm) {
                    setShowExitConfirm(false);
                } else if (isFinished || error) {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFinished, loading, error, showExitConfirm, onClose]);

    const handleChallengeFriend = async () => {
        if (!sessionId) return;
        setIsCreatingChallenge(true);
        try {
            const challenge = await challengeService.createChallenge(gameId, sessionId);
            if (challenge) {
                const challengeUrl = `${window.location.origin}/#/challenge/${challenge.id}`;
                await navigator.clipboard.writeText(`¡Te reto en Andanzas GO! ¿Puedes superar mi puntaje de ${score}?\n\nJuega aquí: ${challengeUrl}`);
                toast.success("¡Enlace copiado al portapapeles! Compártelo con tus amigos.");
            } else {
                toast.error("Hubo un error al crear el reto. Debes iniciar sesión.");
            }
        } catch (e) {
            toast.error("Error al generar el enlace de reto");
        } finally {
            setIsCreatingChallenge(false);
        }
    };



    React.useEffect(() => {
        if (!currentQuestion || isFinished) return;
        setIsShuffling(true);
        let count = 0;
        const interval = setInterval(() => {
            setShuffledCategory(categories[Math.floor(Math.random() * categories.length)]);
            count++;
            if (count > 8) {
                clearInterval(interval);
                setShuffledCategory(currentQuestion.category || "General");
                setTimeout(() => setIsShuffling(false), 600);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [currentQuestionIndex]);

    React.useEffect(() => {
        if (timeRemaining === 0 && !isChecking && !isFinished && !isShuffling) {
            setIsChecking(true);
            setIsCorrect(false);
            setHasTimedOut(true);
        }
    }, [timeRemaining, isChecking, isFinished, isShuffling]);

    const handleAnswerSelect = async (answer: any) => {
        if (isChecking) return;

        // Determinamos la corrección de forma síncrona y la fijamos ANTES de mostrar el panel,
        // para que se pinte directo del color correcto (verde/rojo) sin el parpadeo al color contrario.
        const correct = game?.type === 'quiz' ? true : (currentQuestion ? checkAnswerCorrectness(currentQuestion, answer) : false);
        setSelectedOption(answer);
        setIsCorrect(correct);
        setIsChecking(true);

        // Persistimos y actualizamos el motor (puntos, racha, fin) en segundo plano.
        await submitAnswer(answer, false);
    };

    const handleNext = async () => {
        setIsChecking(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setIsReporting(false);
        setReportReason('');
        setReportSubmitted(false);
        setHasTimedOut(false);
        await nextQuestion();
    };

    const handleSubmitReport = async () => {
        if (!currentQuestion || !reportReason.trim()) return;
        const success = await gamesService.reportQuestion(currentQuestion.id, userProfile?.id, reportReason);
        if (success) {
            setReportSubmitted(true);
            setTimeout(() => setIsReporting(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col bg-slate-950 items-center justify-center" style={{ zIndex: 99999 }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                </div>
                <Trophy className="w-16 h-16 text-primary mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <p className="text-xl font-bold text-white tracking-widest uppercase">Cargando desafío...</p>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="fixed inset-0 flex flex-col bg-slate-950 items-center justify-center p-4" style={{ zIndex: 99999 }}>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    <h3 className="text-2xl font-bold mb-3 text-white">Error al cargar</h3>
                    <p className="text-white/60 mb-8 leading-relaxed">{error || 'No se pudo cargar el juego.'}</p>
                    <Button onClick={onClose} className="w-full bg-white text-slate-900 hover:bg-white/90 rounded-xl h-14 font-bold text-lg">Cerrar</Button>
                </div>
            </div>
        );
    }

    // Identidad visual del juego: cada trivia trae su propio color de acento (theme_accent).
    // Se declara antes de los early-returns para que la pantalla de resultados también la use.
    const accent = game?.theme_accent || '#10B981';

    if (isFinished) {
        return (
            <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-50 overflow-y-auto" style={{ zIndex: 99999 }}>
                {accuracyPercent >= 50 && (
                    <ReactConfetti recycle={false} numberOfPieces={280} gravity={0.25} colors={[accent, '#FFFFFF', '#FDE68A']} style={{ position: 'fixed', inset: 0, zIndex: 100000, pointerEvents: 'none' }} />
                )}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ backgroundColor: `${accent}33` }} />
                    <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full flex flex-col justify-center items-center text-center p-6 py-12 space-y-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="p-8 rounded-full mb-2"
                        style={{
                            backgroundColor: `${accent}1A`,
                            boxShadow: `0 0 0 4px ${accent}33, 0 0 40px ${accent}4D`
                        }}
                    >
                        <Trophy className="w-24 h-24 drop-shadow-md" style={{ color: accent }} />
                    </motion.div>
                    
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">¡Desafío Completado!</h2>
                    
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center">
                            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mb-3" />
                            <span className="text-4xl font-black text-white mb-1">{score}</span>
                            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Puntos</span>
                        </div>
                        {game?.type !== 'quiz' && (
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center">
                                <Target className="w-8 h-8 text-emerald-400 mb-3" />
                                <span className="text-4xl font-black text-white mb-1">{accuracyPercent.toFixed(0)}%</span>
                                <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Precisión</span>
                            </div>
                        )}
                    </div>

                    {(bestCategory || worstCategory) && (
                        <div className="w-full grid grid-cols-2 gap-4">
                            {bestCategory && (
                                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col items-center">
                                    <span className="text-xs text-white/40 uppercase tracking-wider mb-1 font-bold">Mejor Categoría</span>
                                    <span className="text-sm sm:text-base font-bold text-emerald-400 text-center">{bestCategory}</span>
                                </div>
                            )}
                            {worstCategory && (
                                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col items-center">
                                    <span className="text-xs text-white/40 uppercase tracking-wider mb-1 font-bold">Por Mejorar</span>
                                    <span className="text-sm sm:text-base font-bold text-orange-400 text-center">{worstCategory}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {categoryProgress.length > 0 && (
                        <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 p-5 rounded-3xl text-left">
                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3">Tu progreso por categoría</p>
                            <div className="space-y-3">
                                {categoryProgress.map(progress => (
                                    <div key={progress.category} className="space-y-1">
                                        <div className="flex justify-between text-sm"><span className="font-semibold text-white">{progress.category}</span><span className="text-primary font-bold">Nivel {progress.level} · {progress.xp} XP</span></div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, Math.min(100, progress.mastery * 100))}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {game?.related_learn_ids && game.related_learn_ids.length > 0 && (
                        <div className="w-full p-6 bg-primary/10 backdrop-blur-md rounded-3xl border border-primary/20 text-left">
                            <p className="font-bold text-white mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-primary" />Sigue explorando</p>
                            <Button 
                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-14 font-bold"
                                onClick={() => onNavigate?.('paquesepas')}
                            >
                                Leer más en Pa' que sepás
                            </Button>
                        </div>
                    )}

                    <div className="w-full space-y-4 pt-4">
                        {onRetry && (
                            <Button
                                className="w-full rounded-2xl h-16 text-lg font-bold text-white border-none shadow-lg transition-all hover:scale-[1.02]"
                                style={{ backgroundColor: accent }}
                                onClick={onRetry}
                            >
                                <RotateCcw className="w-6 h-6 mr-3" />
                                Reintentar
                            </Button>
                        )}
                        <Button
                            className="w-full rounded-2xl h-16 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02]"
                            onClick={handleChallengeFriend}
                            disabled={isCreatingChallenge}
                        >
                            <Users className="w-6 h-6 mr-3" />
                            {isCreatingChallenge ? "Generando Reto..." : "Retar a un amigo"}
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent rounded-2xl h-16 text-lg font-bold border-white/20 text-white hover:bg-white/10" onClick={onClose}>
                            Volver a Inicio
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans" style={{ zIndex: 99999 }}>
            {/* Dynamic Background — tematizado por juego */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ backgroundColor: `${accent}33` }} />
                <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px]" style={{ backgroundColor: `${accent}22` }} />
                <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[130px]" style={{ backgroundColor: `${accent}1A` }} />
            </div>

            {/* HUD (Floating Pill) */}
            <div className="relative z-10 w-full pt-6 pb-2 px-4 flex justify-center">
                <div className="flex items-center gap-4 sm:gap-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 shadow-2xl">
                    <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full w-8 h-8 text-white/70 hover:text-white transition-colors" onClick={() => setShowExitConfirm(true)}>
                        <X className="w-5 h-5" />
                    </Button>
                    <div className="h-6 w-[1px] bg-white/20" />
                    
                    <div className="flex items-center gap-2 font-bold text-lg text-white">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> {score}
                    </div>

                    {(isLegend || game?.mechanic_type === 'lives') && (
                        <>
                            <div className="h-6 w-[1px] bg-white/20" />
                            <div className="flex items-center gap-1.5 text-red-500">
                                {Array.from({ length: Math.max(3, game?.lives_count || 3) }).map((_, i) => (
                                    <Heart key={i} className={`w-5 h-5 transition-all duration-300 ${i < livesRemaining ? 'fill-current text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-110' : 'fill-transparent stroke-white/30 text-transparent scale-90'}`} strokeWidth={2} />
                                ))}
                            </div>
                        </>
                    )}

                    {(streak >= 3 || (isTimed && streak >= 1)) && (
                        <>
                            <div className="h-6 w-[1px] bg-white/20" />
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-orange-400 font-bold"
                            >
                                <Flame className="w-5 h-5 fill-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" /> x{game?.mechanic_type === 'multiplier' ? Math.min(streak, 5) : streak}
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Exit Confirm Modal */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center">
                            <h3 className="text-2xl font-bold mb-3 text-white">¿Terminar la ronda?</h3>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                {isTimed
                                    ? 'Verás tu resumen. Conservás los puntos según hasta dónde llegaste (la racha se asegura desde la pregunta 11).'
                                    : (!game?.mechanic_type || game.mechanic_type === 'safe_zones')
                                        ? 'Verás tu resumen. Conservás los puntos hasta tu última zona segura.'
                                        : 'Verás tu resumen con los puntos que llevás acumulados.'}
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl h-14 text-lg font-bold border-none"
                                    onClick={async () => { setShowExitConfirm(false); await finishGame(true); }}
                                >
                                    Terminar y ver resumen
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 rounded-xl h-14 text-lg font-bold" onClick={() => setShowExitConfirm(false)}>
                                    Continuar jugando
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ráfaga de confeti al alcanzar una racha */}
            {streakBurst && (
                <ReactConfetti recycle={false} numberOfPieces={140} gravity={0.3} style={{ position: 'fixed', inset: 0, zIndex: 100000, pointerEvents: 'none' }} />
            )}

            {/* Main Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center p-4 sm:p-6 w-full max-w-4xl mx-auto h-full overflow-y-auto overflow-x-hidden scrollbar-none">
                <AnimatePresence mode="wait">
                    {isShuffling ? (
                        <motion.div 
                            key="shuffling"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="flex flex-col items-center justify-center space-y-4 py-12"
                        >
                            <span className="text-white/50 uppercase tracking-widest text-sm font-bold">Categoría</span>
                            <h2 className="text-4xl sm:text-5xl font-black text-white animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{shuffledCategory}</h2>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="question"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col flex-1 my-auto"
                        >
                            <div className="mb-6 w-full max-w-xl mx-auto flex flex-col items-center">
                                {/* Mascota del juego con anillo de tiempo alrededor */}
                                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                                    {game?.type !== 'quiz' && (
                                        <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
                                            <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                                            <motion.circle
                                                cx="48" cy="48" r="42" fill="none"
                                                stroke={(isTimed ? timeRemaining <= 10 : timeRemaining <= 5) ? '#EF4444' : accent}
                                                strokeWidth="6" strokeLinecap="round"
                                                strokeDasharray={2 * Math.PI * 42}
                                                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - timeRemaining / (isTimed ? TIMED_ROUND_SECONDS : (currentQuestion?.time_limit_sec || 30))) }}
                                                transition={{ duration: 1, ease: 'linear' }}
                                                style={{ filter: `drop-shadow(0 0 6px ${(isTimed ? timeRemaining <= 10 : timeRemaining <= 5) ? '#EF4444' : accent})` }}
                                            />
                                        </svg>
                                    )}
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center transition-shadow duration-300"
                                        style={{
                                            backgroundColor: `${accent}22`,
                                            boxShadow: mascotState === 'correct'
                                                ? `0 0 24px 4px ${accent}66`
                                                : mascotState === 'wrong'
                                                    ? '0 0 24px 4px rgba(239,68,68,0.4)'
                                                    : `0 0 16px -2px ${accent}4D`
                                        }}
                                    >
                                        {isTimed ? (
                                            <span className={`text-2xl font-black tabular-nums ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>{timeRemaining}</span>
                                        ) : (
                                            <GameMascot icon={game?.theme_icon} accent={accent} size={44} state={mascotState} />
                                        )}
                                    </div>
                                </div>

                                <span className="text-white/50 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3">
                                    {isLegend ? `Modo Leyenda · Pregunta ${currentQuestionIndex + 1}` : `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`}
                                </span>

                                {/* Puntos de progreso: una perla por pregunta de la partida.
                                    Las zonas seguras (cada 5 preguntas, ver useGameEngine finishGame) se marcan
                                    con un anillo dorado para motivar al jugador a alcanzarlas.
                                    En Modo Leyenda no hay total fijo, así que se omite. */}
                                <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
                                    {!isLegend && questions.map((_, idx) => {
                                        const isPast = idx < currentQuestionIndex;
                                        const isCurrent = idx === currentQuestionIndex;
                                        const isSafeZone = (!game?.mechanic_type || game.mechanic_type === 'safe_zones') && (idx + 1) % 5 === 0;
                                        const baseSize = isCurrent ? 10 : (isSafeZone ? 8 : 6);
                                        return (
                                            <span
                                                key={idx}
                                                className="rounded-full transition-all duration-300"
                                                style={{
                                                    width: baseSize,
                                                    height: baseSize,
                                                    backgroundColor: (isPast || isCurrent) ? accent : (isSafeZone ? 'rgba(250,204,21,0.3)' : 'rgba(255,255,255,0.15)'),
                                                    opacity: idx <= currentQuestionIndex ? 1 : 0.9,
                                                    boxShadow: isSafeZone && !isPast && !isCurrent ? '0 0 0 2px rgba(250,204,21,0.7)' : undefined
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden flex-shrink-0">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-8 mt-2 text-white drop-shadow-md">
                                    {currentQuestion?.question_text}
                                </h2>

                                <div className="w-full overflow-y-auto max-h-[50vh] scrollbar-none pb-2">
                                    {currentQuestion && (
                                        <QuestionRenderer
                                            question={currentQuestion}
                                            gameType={game?.type}
                                            isChecking={isChecking}
                                            hasTimedOut={hasTimedOut}
                                            selectedAnswer={selectedOption}
                                            onSubmit={handleAnswerSelect}
                                            accent={accent}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Panel */}
                <AnimatePresence>
                    {isChecking && (
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`mt-4 mb-8 w-full p-6 sm:p-8 rounded-[2.5rem] border-2 backdrop-blur-2xl shadow-2xl ${game?.type === 'quiz' ? 'bg-primary/10 border-primary/50' : (isCorrect ? 'bg-emerald-500/10 border-emerald-500/50' : (hasTimedOut ? 'bg-orange-500/10 border-orange-500/50' : 'bg-red-500/10 border-red-500/50'))}`}
                        >
                            <h3 className={`text-2xl font-black mb-3 flex items-center ${game?.type === 'quiz' ? 'text-primary' : (isCorrect ? 'text-emerald-400' : (hasTimedOut ? 'text-orange-400' : 'text-red-400'))}`}>
                                {game?.type === 'quiz' ? <CheckCircle2 className="mr-3 w-8 h-8" /> : (isCorrect ? <CheckCircle2 className="mr-3 w-8 h-8" /> : (hasTimedOut ? <Clock className="mr-3 w-8 h-8" /> : <XCircle className="mr-3 w-8 h-8" />))}
                                {game?.type === 'quiz' ? '¡Respuesta registrada!' : (isCorrect ? '¡Correcto!' : (hasTimedOut ? '¡Tiempo Agotado!' : 'Incorrecto'))}
                            </h3>
                            
                            {(() => {
                                const isGameEnding = (!isCorrect || hasTimedOut) && (
                                    isTimed
                                        ? true
                                        : isLegend
                                            ? livesRemaining <= 0
                                            : ((!game?.mechanic_type || game.mechanic_type === 'safe_zones' || game.mechanic_type === 'sudden_death') ||
                                               (game.mechanic_type === 'lives' && livesRemaining <= 0))
                                );

                                if (isGameEnding && (hasTimedOut || !isCorrect)) {
                                    return (
                                        <>
                                            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 font-medium">
                                                {hasTimedOut ? 'Se agotó el tiempo.' : 'Respuesta incorrecta.'} {isTimed ? 'Se acabó tu carrera contrarreloj.' : isLegend ? 'Te quedaste sin vidas.' : 'Has perdido la partida.'}
                                                {!isLegend && !isTimed && (!game?.mechanic_type || game.mechanic_type === 'safe_zones') && ' Tu racha se guardará hasta la última zona segura.'}
                                            </p>
                                            {/* Aun al perder, mostramos la respuesta correcta y la explicación: el momento de mayor aprendizaje. */}
                                            {typeof currentQuestion?.correct_answer === 'string' && currentQuestion.correct_answer && (
                                                <p className="text-white/90 text-base sm:text-lg mb-3">
                                                    <span className="font-bold text-emerald-300">Respuesta correcta:</span> {currentQuestion.correct_answer}
                                                </p>
                                            )}
                                            {currentQuestion?.explanation && (
                                                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                                                    <TextWithDictionaryLinks
                                                        text={currentQuestion.explanation}
                                                        entries={dictEntries}
                                                        onOpen={setDictSelected}
                                                        linkClassName="cursor-pointer font-semibold text-white underline decoration-dotted underline-offset-2"
                                                    />
                                                </p>
                                            )}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {currentQuestion?.related_learn_id && (
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 rounded-2xl h-14 font-bold border-white/20 text-white hover:bg-white/10 text-lg"
                                                        onClick={() => onNavigate?.('paquesepas')}
                                                    >
                                                        Saber más
                                                    </Button>
                                                )}
                                                <Button
                                                    className="flex-1 rounded-2xl h-14 font-bold bg-white text-slate-900 hover:bg-white/90 border-none shadow-lg text-lg"
                                                    onClick={() => finishGame(true)}
                                                >
                                                    Ver Resultados Finales
                                                </Button>
                                            </div>
                                        </>
                                    );
                                }

                                return (
                                <>
                                    {currentQuestion?.explanation && (
                                        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                                            <TextWithDictionaryLinks
                                                text={currentQuestion.explanation}
                                                entries={dictEntries}
                                                onOpen={setDictSelected}
                                                linkClassName="cursor-pointer font-semibold text-white underline decoration-dotted underline-offset-2"
                                            />
                                        </p>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {currentQuestion?.related_learn_id && (
                                            <Button 
                                                variant="outline"
                                                className="flex-1 rounded-2xl h-14 font-bold border-white/20 text-white hover:bg-white/10 text-lg"
                                                onClick={() => onNavigate?.('paquesepas')}
                                            >
                                                Saber más
                                            </Button>
                                        )}
                                        <Button 
                                            className="flex-1 rounded-2xl h-14 font-bold bg-white text-slate-900 hover:bg-white/90 border-none shadow-lg text-lg" 
                                            onClick={handleNext}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </>
                                );
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <DictionaryDetail entry={dictSelected} onClose={() => setDictSelected(null)} />
        </div>
    );
};
