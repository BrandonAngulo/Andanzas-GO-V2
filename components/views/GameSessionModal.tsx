import React, { useState } from 'react';
import { useGameEngine, checkAnswerCorrectness, TIMED_ROUND_SECONDS } from '../../hooks/useGameEngine';
import { Button } from '../ui/button';
import { X, CheckCircle2, XCircle, Trophy, Flame, Clock, Star, Users, Heart, Target, Flag, RotateCcw, Coins, Gem, Zap, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { gamesService, type GameSessionMode } from '../../services/games.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../../contexts/UserDataContext';
import { toast } from 'sonner';
import { QuestionRenderer } from './QuestionRenderer';
import { LazyImage } from '../ui/lazy-image';
import ReactConfetti from 'react-confetti';
import { dictionaryService } from '../../services/dictionary.service';
import { DictionaryDetail } from '../dictionary/DictionaryDetail';
import { TextWithDictionaryLinks } from '../shared/TextWithDictionaryLinks';
import type { DictionaryEntry } from '../../types';
import { isTriviaGo } from '../../lib/gameIdentity';

interface GameSessionModalProps {
    gameId: string;
    onClose: () => void;
    onNavigate?: (panel: string) => void;
    onRetry?: () => void;
    mode?: 'levels' | 'legend' | 'timed';
    theme?: string;
    sessionMode?: GameSessionMode;
}

const QUESTION_ANDI_IMAGE = '/images/games/trivia-go/characters/andi-thinking-question-v1.png';
const SESSION_MODE_LABELS: Record<GameSessionMode, string> = {
    reto: 'Reto',
    clasica: 'Partida clásica',
    contrarreloj: 'Contrarreloj',
    lugar: 'Jugar por lugar',
    vocabulario: 'Vocabulario caleño',
    historia: 'Historia',
};

export const GameSessionModal: React.FC<GameSessionModalProps> = ({ gameId, onClose, onNavigate, onRetry, mode = 'levels', theme, sessionMode = 'reto' }) => {
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
        rewards,
        economy,
        purchaseLives,
        sessionId,
        livesRemaining
    } = useGameEngine(gameId, userProfile?.id, mode, theme, sessionMode);

    const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
    const [purchasingOffer, setPurchasingOffer] = useState<string | null>(null);

    const buyLives = async (offerKey: string) => {
        setPurchasingOffer(offerKey);
        try {
            const updated = await purchaseLives(offerKey);
            toast.success(`¡Listo! Ahora tienes ${updated.lives} vidas.`);
        } catch (error: any) {
            const message = String(error?.message || '');
            toast.error(message.includes('INSUFFICIENT') ? 'No tienes saldo suficiente para esta compra.' : 'No fue posible comprar las vidas.');
        } finally {
            setPurchasingOffer(null);
        }
    };

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
    const mascotState = !isChecking ? 'idle' : (game?.type === 'quiz' ? 'idle' : (isCorrect ? 'correct' : 'wrong'));

    // Ráfaga de confeti al alcanzar una racha importante (cada 3 respuestas correctas seguidas)
    React.useEffect(() => {
        if (isChecking && isCorrect && streak > 0 && streak % 3 === 0) {
            setStreakBurst(true);
            const t = setTimeout(() => setStreakBurst(false), 1600);
            return () => clearTimeout(t);
        }
    }, [isChecking, isCorrect, streak]);

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

    // Atajo post-partida: inicia un DUELO nuevo (modo propio) sobre este mismo juego.
    // El duelo congela su propio set/reglas; no reutiliza esta partida casual.
    const handleChallengeFriend = () => {
        setIsCreatingChallenge(true);
        onClose();
        window.dispatchEvent(new CustomEvent('start-duel', { detail: { gameId } }));
        setIsCreatingChallenge(false);
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
                <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    <h3 className="text-2xl font-bold mb-3 text-white">Error al cargar</h3>
                    <p className="text-white/60 mb-8 leading-relaxed">{error || 'No se pudo cargar el juego.'}</p>
                    <Button onClick={onClose} className="w-full bg-white text-slate-900 hover:bg-white/90 rounded-xl h-14 font-bold text-lg">Cerrar</Button>
                </div>
            </div>
        );
    }

    const usesWalletLives = isLegend || game.mechanic_type === 'lives';
    if (usesWalletLives && livesRemaining <= 0 && !isFinished && !isChecking) {
        return (
            <div className="fixed inset-0 bg-slate-950 text-white grid place-items-center p-5 overflow-y-auto" style={{ zIndex: 99999 }}>
                <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-5 text-center shadow-2xl sm:p-7">
                    <Heart className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-3xl font-black mb-2">Tus vidas se agotaron</h2>
                    <p className="text-white/60 mb-2">Recuperas una vida cada 4 horas, hasta completar {economy?.max_lives || 3}.</p>
                    {economy?.next_life_at && <p className="text-sm text-primary mb-6">Próxima vida: {new Date(economy.next_life_at).toLocaleString('es-CO')}</p>}
                    <div className="flex justify-center gap-5 mb-5 text-sm"><span className="flex gap-1"><Coins className="w-4 h-4 text-yellow-400" /> {economy?.coins || 0}</span><span className="flex gap-1"><Gem className="w-4 h-4 text-cyan-400" /> {economy?.gems || 0}</span></div>
                    <div className="grid grid-cols-2 gap-3">
                        {(economy?.shop_offers || []).map(offer => (
                            <Button key={offer.key} disabled={!!purchasingOffer || offer.quantity > ((economy?.max_lives || 3) - (economy?.lives || 0))} onClick={() => buyLives(offer.key)} className="h-auto py-4 rounded-xl flex-col">
                                <span>{offer.title}</span><small>{offer.price} {offer.currency === 'coin' ? 'monedas' : 'gemas'}</small>
                            </Button>
                        ))}
                    </div>
                    <Button variant="ghost" onClick={onClose} className="mt-5 text-white/70">Volver a juegos</Button>
                </div>
            </div>
        );
    }

    // Identidad visual del juego: cada trivia trae su propio color de acento (theme_accent).
    // Se declara antes de los early-returns para que la pantalla de resultados también la use.
    const accent = game?.theme_accent || '#10B981';
    const triviaGo = isTriviaGo(game);
    const timerTotal = isTimed ? TIMED_ROUND_SECONDS : Math.max(1, currentQuestion?.time_limit_sec || 30);
    const timerPercent = Math.max(0, Math.min(100, (timeRemaining / timerTotal) * 100));
    const timerCritical = isTimed ? timeRemaining <= 10 : timeRemaining <= 5;
    const modeLabel = SESSION_MODE_LABELS[sessionMode] || game.title;

    if (isFinished) {
        return (
            <div className="fixed inset-0 flex flex-col overflow-y-auto overscroll-contain bg-slate-950 text-slate-50" style={{ zIndex: 99999 }}>
                {accuracyPercent >= 50 && (
                    <ReactConfetti recycle={false} numberOfPieces={280} gravity={0.25} colors={[accent, '#FFFFFF', '#FDE68A']} style={{ position: 'fixed', inset: 0, zIndex: 100000, pointerEvents: 'none' }} />
                )}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ backgroundColor: `${accent}33` }} />
                    <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-start gap-3 p-4 py-5 text-center sm:justify-center sm:gap-3.5 sm:py-7">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="rounded-full p-3.5 sm:p-4"
                        style={{
                            backgroundColor: `${accent}1A`,
                            boxShadow: `0 0 0 4px ${accent}33, 0 0 40px ${accent}4D`
                        }}
                    >
                        <Trophy className="h-11 w-11 drop-shadow-md sm:h-14 sm:w-14" style={{ color: accent }} />
                    </motion.div>

                    <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-lg sm:text-3xl">¡Desafío completado!</h2>

                    {/* Tarjeta unificada: puntaje + precisión + categorías, todo en un bloque cohesivo. */}
                    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
                        <div className={`grid ${game?.type !== 'quiz' ? 'grid-cols-2 divide-x' : 'grid-cols-1'} divide-white/10`}>
                            <div className="flex flex-col items-center gap-0.5 p-4">
                                <Star className="mb-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-3xl font-black leading-none text-white">{score}</span>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-white/45">Puntos</span>
                            </div>
                            {game?.type !== 'quiz' && (
                                <div className="flex flex-col items-center gap-0.5 p-4">
                                    <Target className="mb-1 h-5 w-5 text-emerald-400" />
                                    <span className="text-3xl font-black leading-none text-white">{accuracyPercent.toFixed(0)}%</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/45">Precisión</span>
                                </div>
                            )}
                        </div>
                        {(bestCategory || worstCategory) && (
                            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 px-3 py-2.5">
                                {bestCategory && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"><TrendingUp className="h-3.5 w-3.5" />{bestCategory}</span>
                                )}
                                {worstCategory && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300"><ArrowUpRight className="h-3.5 w-3.5" />{worstCategory}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {rewards && (
                        <div className="w-full rounded-2xl border border-white/10 bg-slate-900/50 p-3 sm:p-4">
                            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-white/45">Recompensas de la partida</p>
                            <div className="grid grid-cols-2 gap-2 min-[390px]:grid-cols-4">
                                {[
                                    { Icon: Zap, val: rewards.xp, label: 'XP de perfil', bg: 'bg-violet-500/15', text: 'text-violet-300' },
                                    { Icon: Sparkles, val: rewards.appPoints, label: 'Puntos Andanzas', bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
                                    { Icon: Coins, val: rewards.coins, label: 'Monedas', bg: 'bg-yellow-500/15', text: 'text-yellow-300' },
                                    { Icon: Gem, val: rewards.gems, label: 'Gemas', bg: 'bg-cyan-500/15', text: 'text-cyan-300' },
                                ].map(({ Icon, val, label, bg, text }) => (
                                    <div key={label} className="flex min-w-0 flex-col items-center gap-1 rounded-xl bg-white/[0.025] px-1.5 py-2 min-[390px]:bg-transparent min-[390px]:px-0 min-[390px]:py-0">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bg}`}><Icon className={`h-4 w-4 ${text}`} /></div>
                                        <span className={`text-base font-black leading-none sm:text-lg ${text}`}>+{val}</span>
                                        <span className="text-[10px] leading-tight text-white/45">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {categoryProgress.length > 0 && (
                        <div className="w-full rounded-2xl border border-white/5 bg-slate-900/40 p-3.5 text-left backdrop-blur-md sm:p-4">
                            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-white/45">Tu progreso por categoría</p>
                            <div className="space-y-2.5">
                                {categoryProgress.map(progress => (
                                    <div key={progress.category} className="space-y-1">
                                        <div className="flex justify-between text-xs sm:text-sm"><span className="font-semibold text-white">{progress.category}</span><span className="font-bold text-primary">Nivel {progress.level} · {progress.xp} XP</span></div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, Math.min(100, progress.mastery * 100))}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {game?.related_learn_ids && game.related_learn_ids.length > 0 && (
                        <button
                            type="button"
                            onClick={() => onNavigate?.('paquesepas')}
                            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/10 p-3.5 text-left backdrop-blur-md transition-colors hover:bg-primary/15"
                        >
                            <span className="flex items-center gap-2.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20"><Star className="h-4 w-4 text-primary" /></span>
                                <span className="flex flex-col">
                                    <span className="text-sm font-bold text-white">Sigue explorando</span>
                                    <span className="text-xs text-white/50">Leer más en Pa' que sepás</span>
                                </span>
                            </span>
                            <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" />
                        </button>
                    )}

                    <div className="w-full space-y-2.5 pt-1">
                        {onRetry && (
                            <Button
                                className="h-11 w-full rounded-xl border-none font-bold text-white shadow-lg transition-all hover:scale-[1.01]"
                                style={{ backgroundColor: accent }}
                                onClick={onRetry}
                            >
                                <RotateCcw className="mr-2.5 h-5 w-5" />
                                Reintentar
                            </Button>
                        )}
                        <Button
                            className="h-11 w-full rounded-xl border-none bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.01] hover:from-indigo-600 hover:to-purple-700"
                            onClick={handleChallengeFriend}
                            disabled={isCreatingChallenge}
                        >
                            <Users className="mr-2.5 h-5 w-5" />
                            {isCreatingChallenge ? "Generando Reto..." : "Retar a un amigo"}
                        </Button>
                        <Button variant="outline" className="h-11 w-full rounded-xl border-white/20 bg-transparent font-bold text-white hover:bg-white/10" onClick={onClose}>
                            Volver a Inicio
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#06272d] font-sans text-slate-50" style={{ zIndex: 99999 }}>
            {/* Escenario ilustrado, compartido por TRIVIA GO sin tapar la legibilidad. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {triviaGo ? <div className="absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-center opacity-[0.24]" /> : null}
                <div className="absolute inset-0 bg-gradient-to-br from-[#06272d]/96 via-[#063c40]/92 to-slate-950/95" />
                <div className="absolute -left-[12%] -top-[24%] h-[55vw] w-[55vw] rounded-full blur-[130px]" style={{ backgroundColor: `${accent}32` }} />
                <div className="absolute -bottom-[30%] right-[2%] h-[55vw] w-[55vw] rounded-full bg-amber-300/10 blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_center,white_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
            </div>

            {/* HUD compacto: identidad de la partida y estado del jugador. */}
            <div className="relative z-20 px-2.5 pt-2.5 sm:px-4 sm:pt-3">
                <div className="mx-auto flex min-h-12 w-full max-w-6xl items-center gap-2 rounded-2xl border border-white/15 bg-[#063c40]/78 px-2 py-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:gap-3 sm:px-3">
                    <Button variant="ghost" size="icon" aria-label="Salir de la partida" className="h-9 w-9 shrink-0 rounded-xl text-white/75 transition-colors hover:bg-white/10 hover:text-white" onClick={() => setShowExitConfirm(true)}>
                        <X className="h-5 w-5" />
                    </Button>
                    <div className="min-w-0 flex-1 border-l border-white/10 pl-2.5 sm:pl-3">
                        <p className="truncate text-[7px] font-black uppercase tracking-[0.18em] text-amber-300">TRIVIA GO · {modeLabel}</p>
                        <p className="truncate text-[11px] font-black text-white sm:text-xs">{game.title}</p>
                    </div>

                    <div className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-black/15 px-2.5 font-black text-white" aria-label={`${score} puntos`}>
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.45)]" />
                        <span className="tabular-nums">{score}</span>
                    </div>

                    {(isLegend || game?.mechanic_type === 'lives') && (
                        <>
                            <div className="hidden h-6 w-px bg-white/15 sm:block" />
                            <div className="hidden items-center gap-1 text-red-400 sm:flex" aria-label={`${livesRemaining} vidas disponibles`}>
                                {Array.from({ length: Math.max(3, game?.lives_count || 3) }).map((_, i) => (
                                    <Heart key={i} className={`h-4 w-4 transition-all duration-300 ${i < livesRemaining ? 'scale-110 fill-current text-red-400' : 'scale-90 fill-transparent stroke-white/25 text-transparent'}`} strokeWidth={2} />
                                ))}
                            </div>
                        </>
                    )}

                    {(streak >= 3 || (isTimed && streak >= 1)) && (
                        <>
                            <div className="hidden h-6 w-px bg-white/15 sm:block" />
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="flex h-9 items-center gap-1 rounded-xl bg-orange-400/10 px-2 text-xs font-black text-orange-300"
                                aria-label={`Racha de ${streak}`}
                            >
                                <Flame className="h-4 w-4 fill-orange-300" /> x{game?.mechanic_type === 'multiplier' ? Math.min(streak, 5) : streak}
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
                        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
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
            <div className="scrollbar-none relative z-10 mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center overflow-x-hidden overflow-y-auto overscroll-contain px-2.5 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                <AnimatePresence mode="wait">
                    {isShuffling ? (
                        <motion.div 
                            key="shuffling"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="my-auto flex flex-col items-center justify-center space-y-2 py-8"
                        >
                            <motion.img src={QUESTION_ANDI_IMAGE} alt="Andi piensa en la próxima categoría" className="h-40 w-40 object-contain drop-shadow-2xl sm:h-52 sm:w-52" animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">Preparando tu pregunta</span>
                            <h2 className="animate-pulse text-2xl font-black text-white sm:text-3xl">{shuffledCategory}</h2>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="question"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="my-auto flex w-full flex-1 flex-col justify-center"
                        >
                            <section className="relative w-full overflow-hidden rounded-[1.65rem] border border-white/15 bg-[#082f35]/84 shadow-[0_22px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:rounded-[2rem]">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-amber-300/[0.04]" />
                                <div className="relative border-b border-white/10 px-3 py-3 sm:px-5 sm:py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-white" style={{ backgroundColor: `${accent}CC` }}>{currentQuestion?.category || 'Cultura general'}</span>
                                                <span className="text-[8px] font-black uppercase tracking-[0.17em] text-white/50">{isLegend ? `Pregunta ${currentQuestionIndex + 1}` : `${currentQuestionIndex + 1} de ${questions.length}`}</span>
                                            </div>
                                        </div>

                                        {game?.type !== 'quiz' ? <div className={`w-36 shrink-0 rounded-xl border px-2.5 py-2 sm:w-44 ${timerCritical ? 'border-red-300/35 bg-red-500/[0.12]' : 'border-white/10 bg-black/15'}`} aria-label={`${timeRemaining} segundos restantes`}>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`flex items-center gap-1 text-[7px] font-black uppercase tracking-[0.12em] ${timerCritical ? 'text-red-200' : 'text-white/55'}`}><Clock className="h-3.5 w-3.5" />{isTimed ? 'Ronda' : 'Tiempo'}</span>
                                                <strong className={`text-sm font-black tabular-nums ${timerCritical ? 'text-red-300' : 'text-white'}`}>{timeRemaining}s</strong>
                                            </div>
                                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/30">
                                                <motion.div className={`h-full rounded-full ${timerCritical ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-amber-300 to-emerald-400'}`} animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.8, ease: 'linear' }} />
                                            </div>
                                        </div> : <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white/60">Sin reloj</span>}
                                    </div>

                                    {!isLegend ? <div className="mt-3 flex gap-1" aria-label={`Progreso: pregunta ${currentQuestionIndex + 1} de ${questions.length}`}>
                                        {questions.map((question, idx) => {
                                            const isPast = idx < currentQuestionIndex;
                                            const isCurrent = idx === currentQuestionIndex;
                                            const isSafeZone = (!game?.mechanic_type || game.mechanic_type === 'safe_zones') && (idx + 1) % 5 === 0;
                                            return <span key={question.id || idx} className={`relative h-1.5 min-w-0 flex-1 overflow-visible rounded-full transition-all duration-300 ${idx > currentQuestionIndex ? 'bg-white/10' : ''}`} style={(isPast || isCurrent) ? { backgroundColor: accent } : undefined}>
                                                {isSafeZone ? <span className={`absolute -right-0.5 -top-1 h-3 w-1 rounded-full ${idx <= currentQuestionIndex ? 'bg-amber-200' : 'bg-amber-300/45'}`} /> : null}
                                            </span>;
                                        })}
                                    </div> : null}
                                </div>

                                <div className="relative grid items-stretch lg:grid-cols-[9.5rem_minmax(0,1fr)]">
                                    {triviaGo ? <aside className="relative hidden min-h-[24rem] overflow-hidden border-r border-white/10 bg-gradient-to-b from-emerald-400/10 to-transparent lg:flex lg:items-end lg:justify-center">
                                        <div className="absolute left-3 top-4 rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-[9px] font-bold leading-relaxed text-white/70">Andi está pensando<br /><strong className="text-amber-200">¿Cuál elegirías?</strong></div>
                                        <motion.img
                                            src={QUESTION_ANDI_IMAGE}
                                            alt="Andi piensa mientras eliges una respuesta"
                                            className="h-56 w-56 max-w-none translate-y-5 object-contain drop-shadow-[0_15px_24px_rgba(0,0,0,0.38)]"
                                            animate={mascotState === 'correct' ? { y: [0, -10, 0], rotate: [0, -2, 2, 0] } : mascotState === 'wrong' ? { x: [0, -5, 5, -3, 3, 0] } : { y: [0, -4, 0] }}
                                            transition={mascotState === 'idle' ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.55 }}
                                        />
                                    </aside> : null}

                                    <div className="min-w-0 p-3 sm:p-5 lg:p-6">
                                        {triviaGo ? <div className="mb-2 flex items-center gap-2 lg:hidden"><img src={QUESTION_ANDI_IMAGE} alt="" aria-hidden="true" className="h-11 w-11 object-contain drop-shadow-lg" /><span className="rounded-2xl rounded-bl-sm bg-white/[0.08] px-3 py-2 text-[9px] font-semibold text-white/70">Piensa con calma y elige tu mejor respuesta.</span></div> : null}
                                        <h2 className="mx-auto max-w-4xl text-center text-xl font-black leading-tight text-white sm:text-2xl lg:text-3xl">
                                            {currentQuestion?.question_text}
                                        </h2>

                                        {currentQuestion?.prompt_image_url && (
                                            <div className="mx-auto mb-4 mt-4 flex max-h-[25vh] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-1 shadow-xl">
                                                <LazyImage src={currentQuestion.prompt_image_url} alt="Referencia visual de la pregunta" className="max-h-[23vh] w-auto rounded-xl object-contain" />
                                            </div>
                                        )}

                                        <div className="scrollbar-none mt-4 max-h-[46vh] w-full overflow-y-auto pb-1 sm:mt-5">
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
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Panel */}
                <AnimatePresence>
                    {isChecking && (
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`mb-4 mt-3 w-full rounded-[1.5rem] border-2 p-4 shadow-2xl backdrop-blur-2xl sm:rounded-[2rem] sm:p-6 ${game?.type === 'quiz' ? 'bg-primary/10 border-primary/50' : (isCorrect ? 'bg-emerald-500/10 border-emerald-500/50' : (hasTimedOut ? 'bg-orange-500/10 border-orange-500/50' : 'bg-red-500/10 border-red-500/50'))}`}
                        >
                            <h3 className={`mb-2 flex items-center text-xl font-black ${game?.type === 'quiz' ? 'text-primary' : (isCorrect ? 'text-emerald-400' : (hasTimedOut ? 'text-orange-400' : 'text-red-400'))}`}>
                                {game?.type === 'quiz' ? <CheckCircle2 className="mr-2 h-6 w-6" /> : (isCorrect ? <CheckCircle2 className="mr-2 h-6 w-6" /> : (hasTimedOut ? <Clock className="mr-2 h-6 w-6" /> : <XCircle className="mr-2 h-6 w-6" />))}
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
                                            <p className="mb-5 text-sm font-medium leading-relaxed text-white/80 sm:text-base">
                                                {hasTimedOut ? 'Se agotó el tiempo.' : 'Respuesta incorrecta.'} {isTimed ? 'Se acabó tu carrera contrarreloj.' : isLegend ? 'Te quedaste sin vidas.' : 'Has perdido la partida.'}
                                                {!isLegend && !isTimed && (!game?.mechanic_type || game.mechanic_type === 'safe_zones') && ' Tu racha se guardará hasta la última zona segura.'}
                                            </p>
                                            {/* Aun al perder, mostramos la respuesta correcta y la explicación: el momento de mayor aprendizaje. */}
                                            {typeof currentQuestion?.correct_answer === 'string' && currentQuestion.correct_answer && (
                                                <p className="mb-2 text-sm text-white/90 sm:text-base">
                                                    <span className="font-bold text-emerald-300">Respuesta correcta:</span> {currentQuestion.correct_answer}
                                                </p>
                                            )}
                                            {currentQuestion?.explanation && (
                                                <p className="mb-5 text-sm leading-relaxed text-white/80 sm:text-base">
                                                    <TextWithDictionaryLinks
                                                        text={currentQuestion.explanation}
                                                        entries={dictEntries}
                                                        onOpen={setDictSelected}
                                                        linkClassName="cursor-pointer font-semibold text-white underline decoration-dotted underline-offset-2"
                                                    />
                                                </p>
                                            )}
                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                {(isLegend || game?.mechanic_type === 'lives') && economy && (
                                                    <div className="w-full grid grid-cols-2 gap-2 mb-2 sm:col-span-2">
                                                        {economy.shop_offers.map(offer => (
                                                            <Button key={offer.key} variant="outline" disabled={!!purchasingOffer || offer.quantity > (economy.max_lives - economy.lives)} onClick={() => buyLives(offer.key)} className="h-auto py-3 border-white/20 text-white">
                                                                +{offer.quantity} {offer.quantity === 1 ? 'vida' : 'vidas'} · {offer.price} {offer.currency === 'coin' ? 'monedas' : 'gemas'}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                                {currentQuestion?.related_learn_id && (
                                                    <Button
                                                        variant="outline"
                                                        className="h-11 flex-1 rounded-xl border-white/20 font-bold text-white hover:bg-white/10"
                                                        onClick={() => onNavigate?.('paquesepas')}
                                                    >
                                                        Saber más
                                                    </Button>
                                                )}
                                                <Button
                                                    className="h-11 flex-1 rounded-xl border-none bg-white font-bold text-slate-900 shadow-lg hover:bg-white/90"
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
                                        <p className="mb-5 text-sm leading-relaxed text-white/80 sm:text-base">
                                            <TextWithDictionaryLinks
                                                text={currentQuestion.explanation}
                                                entries={dictEntries}
                                                onOpen={setDictSelected}
                                                linkClassName="cursor-pointer font-semibold text-white underline decoration-dotted underline-offset-2"
                                            />
                                        </p>
                                    )}
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        {currentQuestion?.related_learn_id && (
                                            <Button 
                                                variant="outline"
                                                className="h-11 flex-1 rounded-xl border-white/20 font-bold text-white hover:bg-white/10"
                                                onClick={() => onNavigate?.('paquesepas')}
                                            >
                                                Saber más
                                            </Button>
                                        )}
                                        <Button 
                                            className="h-11 flex-1 rounded-xl border-none bg-white font-bold text-slate-900 shadow-lg hover:bg-white/90"
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
