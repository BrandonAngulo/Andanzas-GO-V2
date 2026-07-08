import React, { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { Button } from '../ui/button';
import { X, CheckCircle2, XCircle, Trophy, Flame, Clock, Star, Flag, Users, Copy } from 'lucide-react';
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
        sessionId
    } = useGameEngine(gameId, userProfile?.id);

    const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
    
    React.useEffect(() => {
        if (isFinished && challengeId && sessionId) {
            // It's a challenge mode, complete it
            // We need to determine the winner, but for now we just mark it complete
            // and the verdict screen will do the math.
            challengeService.completeChallenge(challengeId, sessionId, null).then(() => {
                // Redirect to challenge verdict
                window.location.href = `/challenge/${challengeId}/verdict`;
            });
        }
    }, [isFinished, challengeId, sessionId]);

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
            setTimeout(() => {
                setIsReporting(false);
            }, 2000);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="animate-pulse flex flex-col items-center">
                    <Trophy className="w-12 h-12 text-primary mb-4 animate-bounce" />
                    <p className="text-lg font-medium">Cargando desafío...</p>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <div className="bg-card p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-border">
                    <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Error al cargar</h3>
                    <p className="text-muted-foreground mb-6">{error || 'No se pudo cargar el juego.'}</p>
                    <Button onClick={onClose} className="w-full">Cerrar</Button>
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col bg-background p-4 sm:p-8">
                <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center items-center text-center space-y-6">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="bg-primary/10 p-6 rounded-full mb-4"
                    >
                        <Trophy className="w-24 h-24 text-primary" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold">¡Desafío Completado!</h2>
                    
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center">
                            <Star className="w-8 h-8 text-yellow-500 mb-2" />
                            <span className="text-3xl font-bold">{score}</span>
                            <span className="text-xs text-muted-foreground uppercase">Puntos</span>
                        </div>
                        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                            <span className="text-3xl font-bold">{accuracyPercent.toFixed(0)}%</span>
                            <span className="text-xs text-muted-foreground uppercase">Precisión</span>
                        </div>
                    </div>

                    {(bestCategory || worstCategory) && (
                        <div className="w-full mt-2 grid grid-cols-2 gap-4">
                            {bestCategory && (
                                <div className="bg-card border border-border p-3 rounded-xl flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground uppercase mb-1">Mejor</span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 text-center">{bestCategory}</span>
                                </div>
                            )}
                            {worstCategory && (
                                <div className="bg-card border border-border p-3 rounded-xl flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground uppercase mb-1">Por Mejorar</span>
                                    <span className="text-sm font-semibold text-orange-500 text-center">{worstCategory}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {game?.related_learn_ids && game.related_learn_ids.length > 0 && (
                        <div className="w-full mt-4 p-4 bg-muted/50 rounded-2xl text-left border border-border">
                            <p className="font-semibold mb-2">Para seguir explorando este tema:</p>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start border-primary/50 text-primary"
                                onClick={() => onNavigate?.('paquesepas')}
                            >
                                <Star className="w-4 h-4 mr-2" /> Leer más en Pa' que sepás
                            </Button>
                        </div>
                    )}

                    <div className="w-full space-y-3 mt-8">
                        <Button 
                            className="w-full rounded-xl py-6 text-lg font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-none shadow-lg shadow-purple-500/30"
                            onClick={handleChallengeFriend}
                            disabled={isCreatingChallenge}
                        >
                            <Users className="w-5 h-5 mr-2" />
                            {isCreatingChallenge ? "Generando Reto..." : "Retar a un amigo"}
                        </Button>
                        <Button variant="outline" className="w-full rounded-xl py-6 text-lg" onClick={onClose}>
                            Volver
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background">
            {/* Header / HUD */}
            <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => setShowExitConfirm(true)}>
                    <X className="w-6 h-6" />
                </Button>
                
                <div className="flex items-center gap-4">
                    {streak >= 3 && (
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="flex items-center text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full text-sm font-bold"
                        >
                            <Flame className="w-4 h-4 mr-1" /> x{streak}
                        </motion.div>
                    )}
                    <div className="flex items-center text-primary font-bold">
                        <Star className="w-5 h-5 mr-1" /> {score}
                    </div>
                </div>
            </div>

            {/* Progress Bar with Safe Zones */}
            <div className="w-full h-2 bg-muted relative">
                <div 
                    className="absolute h-2 bg-primary transition-all duration-500 ease-in-out" 
                    style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                />
                {questions.length > 0 && Array.from({ length: Math.floor(questions.length / 5) }).map((_, i) => {
                    const zoneIndex = (i + 1) * 5;
                    if (zoneIndex >= questions.length) return null;
                    const isReached = currentQuestionIndex >= zoneIndex;
                    return (
                        <div 
                            key={zoneIndex} 
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 transition-colors duration-500 z-10 
                                ${isReached ? 'bg-primary shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-muted-foreground/30'}`}
                            style={{ left: `${(zoneIndex / questions.length) * 100}%` }}
                        >
                            <Flag className={`w-3 h-3 absolute -top-4 -left-0 ${isReached ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        </div>
                    );
                })}
            </div>

            {/* Exit Confirm Modal */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="bg-card p-6 rounded-2xl max-w-sm w-full border border-border shadow-xl text-center">
                            <h3 className="text-xl font-bold mb-2">¿Abandonar juego?</h3>
                            <p className="text-muted-foreground mb-6">Tu progreso desde la última zona segura se perderá. ¿Estás seguro que deseas salir?</p>
                            <div className="flex flex-col gap-3">
                                <Button 
                                    variant="destructive" 
                                    className="w-full" 
                                    onClick={async () => { await finishGame(true); onClose(); }}
                                >
                                    Sí, salir
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => setShowExitConfirm(false)}>Continuar jugando</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col max-w-2xl mx-auto w-full">
                
                <div className="flex justify-between items-center mb-6 mt-4">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Pregunta {currentQuestionIndex + 1} de {questions.length}
                    </span>
                    <div className={`flex items-center font-bold px-3 py-1 rounded-full ${timeRemaining <= 5 ? 'text-destructive bg-destructive/10 animate-pulse' : 'text-primary bg-primary/10'}`}>
                        <Clock className="w-4 h-4 mr-2" /> 00:{timeRemaining.toString().padStart(2, '0')}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isShuffling ? (
                        <motion.div 
                            key="shuffling"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="flex flex-col items-center justify-center space-y-4 py-12"
                        >
                            <span className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Seleccionando Categoría...</span>
                            <h2 className="text-4xl font-black text-primary animate-pulse">{shuffledCategory}</h2>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="question"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col flex-1"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-8">
                                {currentQuestion?.question_text}
                            </h2>

                            <div className="space-y-3 mt-auto">
                                {currentQuestion?.options.map((opt: string, idx: number) => {
                        let buttonStateClass = "bg-card border-border hover:bg-muted";
                        
                        if (isChecking && !hasTimedOut) {
                            if (opt === currentQuestion.correct_answer) {
                                buttonStateClass = "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400";
                            } else if (opt === selectedOption) {
                                buttonStateClass = "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400";
                            } else {
                                buttonStateClass = "opacity-50";
                            }
                        } else if (isChecking && hasTimedOut) {
                            buttonStateClass = "opacity-50";
                        }

                        return (
                            <Button 
                                key={idx}
                                variant="outline"
                                className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl border-2 transition-all ${buttonStateClass}`}
                                onClick={() => handleAnswerSelect(opt)}
                                disabled={isChecking}
                            >
                                <span className="mr-4 w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-sm">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-base font-medium whitespace-normal">{opt}</span>
                            </Button>
                        );
                    })}
                </div>
                </motion.div>
                )}
                </AnimatePresence>

                {/* Feedback Panel */}
                <AnimatePresence>
                    {isChecking && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`mt-6 p-6 rounded-2xl border-2 ${isCorrect ? 'bg-green-500/10 border-green-500' : (hasTimedOut ? 'bg-orange-500/10 border-orange-500' : 'bg-red-500/10 border-red-500')}`}
                        >
                            <h3 className={`text-xl font-bold mb-2 flex items-center ${isCorrect ? 'text-green-600 dark:text-green-400' : (hasTimedOut ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400')}`}>
                                {isCorrect ? <CheckCircle2 className="mr-2" /> : (hasTimedOut ? <Clock className="mr-2" /> : <XCircle className="mr-2" />)}
                                {isCorrect ? '¡Correcto!' : (hasTimedOut ? '¡Tiempo Agotado!' : 'Incorrecto')}
                            </h3>
                            
                            {hasTimedOut ? (
                                <>
                                    <p className="text-foreground text-sm leading-relaxed mb-6 font-semibold">
                                        Se agotó el tiempo y has perdido la partida. Tu racha se guardará hasta este punto.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <Button 
                                            className="w-full rounded-xl py-6 font-bold bg-orange-500 hover:bg-orange-600 text-white" 
                                            onClick={() => finishGame(true)}
                                        >
                                            Ver Resultados Finales
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            className="w-full rounded-xl py-6 font-bold border-2" 
                                            onClick={async () => { await finishGame(true); onClose(); }}
                                        >
                                            Salir al Menú
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {currentQuestion?.explanation && (
                                        <p className="text-foreground text-sm leading-relaxed mb-6">
                                            {currentQuestion.explanation}
                                        </p>
                                    )}
                                    {currentQuestion?.related_learn_id && (
                                        <Button 
                                            variant="outline"
                                            className="w-full rounded-xl py-4 font-medium mb-3 border-primary/50 text-primary"
                                            onClick={() => onNavigate?.('paquesepas')}
                                        >
                                            Leer más en Pa' que sepás
                                        </Button>
                                    )}
                                    <Button 
                                        className="w-full rounded-xl py-6 font-bold" 
                                        onClick={handleNext}
                                    >
                                        Siguiente
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {isChecking && !isReporting && !reportSubmitted && (
                    <div className="mt-4 text-center">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setIsReporting(true)}>
                            <Flag className="w-4 h-4 mr-2" /> Reportar un problema con esta pregunta
                        </Button>
                    </div>
                )}
                
                {isReporting && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="mt-4 p-4 border border-border rounded-xl bg-card"
                    >
                        <h4 className="font-semibold mb-2">Reportar Pregunta</h4>
                        {reportSubmitted ? (
                            <div className="text-green-600 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Reporte enviado con éxito. Gracias.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Textarea 
                                    placeholder="¿Qué problema encontraste? (ej. respuesta incorrecta, error ortográfico...)" 
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="resize-none"
                                    rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setIsReporting(false)}>Cancelar</Button>
                                    <Button size="sm" onClick={handleSubmitReport} disabled={!reportReason.trim()}>Enviar Reporte</Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
