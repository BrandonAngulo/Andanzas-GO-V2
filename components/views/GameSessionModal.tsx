import React, { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { Button } from '../ui/button';
import { X, CheckCircle2, XCircle, Trophy, Flame, Clock, Star, Users, Heart, Target, Flag } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { gamesService } from '../../services/games.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../../contexts/UserDataContext';
import { toast } from 'sonner';
import { challengeService } from '../../services/challenge.service';

interface GameSessionModalProps {
    gameId: string;
    onClose: () => void;
    onNavigate?: (panel: string) => void;
    challengeId?: string;
}

export const GameSessionModal: React.FC<GameSessionModalProps> = ({ gameId, onClose, onNavigate, challengeId }) => {
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
        sessionId,
        livesRemaining
    } = useGameEngine(gameId, userProfile?.id);

    const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const [isReporting, setIsReporting] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);
    
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [hasTimedOut, setHasTimedOut] = useState(false);

    const [isShuffling, setIsShuffling] = useState(false);
    const [shuffledCategory, setShuffledCategory] = useState("Salsa");
    const categories = ["Historia", "Arte", "Salsa", "Naturaleza", "Gastronomía", "Literatura", "General"];

    React.useEffect(() => {
        if (isFinished && challengeId && sessionId) {
            challengeService.completeChallenge(challengeId, sessionId, null).then(() => {
                window.location.href = `/challenge/${challengeId}/verdict`;
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
                const challengeUrl = `${window.location.origin}/challenge/${challenge.id}`;
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

    const handleAnswerSelect = async (option: string) => {
        if (isChecking) return;
        
        setSelectedOption(option);
        setIsChecking(true);
        
        const correct = await submitAnswer(option, false);
        setIsCorrect(correct);
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

    if (isFinished) {
        return (
            <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-50 overflow-y-auto" style={{ zIndex: 99999 }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-yellow-500/20 rounded-full blur-[120px]" />
                    <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px]" />
                </div>
                
                <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full flex flex-col justify-center items-center text-center p-6 py-12 space-y-8">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="bg-yellow-500/10 p-8 rounded-full mb-2 ring-4 ring-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.3)]"
                    >
                        <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-md" />
                    </motion.div>
                    
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">¡Desafío Completado!</h2>
                    
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center">
                            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mb-3" />
                            <span className="text-4xl font-black text-white mb-1">{score}</span>
                            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Puntos</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center">
                            <Target className="w-8 h-8 text-emerald-400 mb-3" />
                            <span className="text-4xl font-black text-white mb-1">{accuracyPercent.toFixed(0)}%</span>
                            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Precisión</span>
                        </div>
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
                        <Button 
                            className="w-full rounded-2xl h-16 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02]"
                            onClick={handleChallengeFriend}
                            disabled={isCreatingChallenge}
                        >
                            <Users className="w-6 h-6 mr-3" />
                            {isCreatingChallenge ? "Generando Reto..." : "Retar a un amigo"}
                        </Button>
                        <Button variant="outline" className="w-full rounded-2xl h-16 text-lg font-bold border-white/20 text-white hover:bg-white/10" onClick={onClose}>
                            Volver a Inicio
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans" style={{ zIndex: 99999 }}>
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-emerald-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[130px]" />
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

                    {game?.mechanic_type === 'lives' && (
                        <>
                            <div className="h-6 w-[1px] bg-white/20" />
                            <div className="flex items-center gap-1.5 text-red-500">
                                {Array.from({ length: Math.max(3, game.lives_count || 3) }).map((_, i) => (
                                    <Heart key={i} className={`w-5 h-5 transition-all duration-300 ${i < livesRemaining ? 'fill-current text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-110' : 'fill-transparent stroke-white/30 text-transparent scale-90'}`} strokeWidth={2} />
                                ))}
                            </div>
                        </>
                    )}

                    {streak >= 3 && (
                        <>
                            <div className="h-6 w-[1px] bg-white/20" />
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-orange-400 font-bold"
                            >
                                <Flame className="w-5 h-5 fill-orange-400 drop-shadow-[0_0_8px_rgba(2fb,146,60,0.5)]" /> x{game?.mechanic_type === 'multiplier' ? Math.min(streak, 5) : streak}
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
                            <h3 className="text-2xl font-bold mb-3 text-white">¿Abandonar juego?</h3>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                {(!game?.mechanic_type || game.mechanic_type === 'safe_zones') 
                                    ? 'Tu progreso desde la última zona segura se perderá.' 
                                    : 'Perderás el progreso de la partida actual.'}
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button 
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl h-14 text-lg font-bold border-none"
                                    onClick={async () => { await finishGame(true); onClose(); }}
                                >
                                    Sí, salir
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 rounded-xl h-14 text-lg font-bold" onClick={() => setShowExitConfirm(false)}>
                                    Continuar jugando
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                <span className="text-white/50 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3">
                                    Pregunta {currentQuestionIndex + 1} de {questions.length}
                                </span>
                                
                                {/* Visible Timer Progress Bar */}
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                                    <motion.div 
                                        className={`h-full rounded-full ${timeRemaining <= 5 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]'}`} 
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(timeRemaining / (currentQuestion?.time_limit_sec || 30)) * 100}%` }}
                                        transition={{ duration: 1, ease: 'linear' }}
                                    />
                                </div>
                            </div>

                            <div className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden flex-shrink-0">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-8 mt-2 text-white drop-shadow-md">
                                    {currentQuestion?.question_text}
                                </h2>

                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 overflow-y-auto max-h-[50vh] scrollbar-none pb-2">
                                    {currentQuestion?.options.map((opt: string, idx: number) => {
                                        let buttonStateClass = "bg-white/5 border-white/10 hover:bg-white/10 text-white/90";
                                        
                                        if (isChecking && !hasTimedOut) {
                                            if (opt === currentQuestion.correct_answer) {
                                                buttonStateClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                                            } else if (opt === selectedOption) {
                                                buttonStateClass = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                                            } else {
                                                buttonStateClass = "opacity-30 border-white/5 text-white/90";
                                            }
                                        } else if (isChecking && hasTimedOut) {
                                            if (opt === currentQuestion.correct_answer) {
                                                buttonStateClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                                            } else {
                                                buttonStateClass = "opacity-30 border-white/5 text-white/90";
                                            }
                                        }

                                        return (
                                            <Button 
                                                key={idx}
                                                variant="outline"
                                                className={`w-full justify-start text-left h-auto py-5 px-6 rounded-2xl border-2 transition-all duration-300 ${buttonStateClass} ${!isChecking ? 'hover:scale-[1.02]' : ''}`}
                                                onClick={() => handleAnswerSelect(opt)}
                                                disabled={isChecking}
                                            >
                                                <span className="mr-5 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span className="text-base sm:text-lg font-semibold whitespace-normal">{opt}</span>
                                            </Button>
                                        );
                                    })}
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
                            className={`mt-4 mb-8 w-full p-6 sm:p-8 rounded-[2.5rem] border-2 backdrop-blur-2xl shadow-2xl ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/50' : (hasTimedOut ? 'bg-orange-500/10 border-orange-500/50' : 'bg-red-500/10 border-red-500/50')}`}
                        >
                            <h3 className={`text-2xl font-black mb-3 flex items-center ${isCorrect ? 'text-emerald-400' : (hasTimedOut ? 'text-orange-400' : 'text-red-400')}`}>
                                {isCorrect ? <CheckCircle2 className="mr-3 w-8 h-8" /> : (hasTimedOut ? <Clock className="mr-3 w-8 h-8" /> : <XCircle className="mr-3 w-8 h-8" />)}
                                {isCorrect ? '¡Correcto!' : (hasTimedOut ? '¡Tiempo Agotado!' : 'Incorrecto')}
                            </h3>
                            
                            {(() => {
                                const isGameEnding = (!isCorrect || hasTimedOut) && (
                                    (!game?.mechanic_type || game.mechanic_type === 'safe_zones' || game.mechanic_type === 'sudden_death') ||
                                    (game.mechanic_type === 'lives' && livesRemaining <= 0)
                                );

                                if (isGameEnding && (hasTimedOut || !isCorrect)) {
                                    return (
                                        <>
                                            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 font-medium">
                                                {hasTimedOut ? 'Se agotó el tiempo.' : 'Respuesta incorrecta.'} Has perdido la partida. 
                                                {(!game?.mechanic_type || game.mechanic_type === 'safe_zones') && ' Tu racha se guardará hasta la última zona segura.'}
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button 
                                                    className="w-full rounded-2xl h-14 font-bold bg-white text-slate-900 hover:bg-white/90 border-none shadow-lg text-lg" 
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
                                            {currentQuestion.explanation}
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
        </div>
    );
};
