import React, { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { Button } from '../ui/button';
import { X, CheckCircle2, XCircle, Trophy, Flame, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../../contexts/UserDataContext';

interface GameSessionModalProps {
    gameId: string;
    onClose: () => void;
}

export const GameSessionModal: React.FC<GameSessionModalProps> = ({ gameId, onClose }) => {
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
        accuracyPercent
    } = useGameEngine(gameId, userProfile?.id);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
        await nextQuestion();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="animate-pulse flex flex-col items-center">
                    <Trophy className="w-12 h-12 text-primary mb-4 animate-bounce" />
                    <p className="text-lg font-medium">Cargando desafío...</p>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
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
            <div className="fixed inset-0 z-50 flex flex-col bg-background p-4 sm:p-8">
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

                    <div className="w-full space-y-3 mt-8">
                        <Button className="w-full rounded-xl py-6 text-lg" onClick={onClose}>
                            Volver al Mapa
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
            {/* Header / HUD */}
            <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
                <Button variant="ghost" size="icon" onClick={onClose}>
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

            <div className="w-full h-1 bg-muted">
                <div 
                    className="h-1 bg-primary transition-all duration-500 ease-in-out" 
                    style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                />
            </div>

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

                <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-8">
                    {currentQuestion?.question_text}
                </h2>

                <div className="space-y-3 mt-auto">
                    {currentQuestion?.options.map((opt: string, idx: number) => {
                        let buttonStateClass = "bg-card border-border hover:bg-muted";
                        
                        if (isChecking) {
                            if (opt === currentQuestion.correct_answer) {
                                buttonStateClass = "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400";
                            } else if (opt === selectedOption) {
                                buttonStateClass = "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400";
                            } else {
                                buttonStateClass = "opacity-50";
                            }
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

                {/* Feedback Panel */}
                <AnimatePresence>
                    {isChecking && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`mt-6 p-6 rounded-2xl border-2 ${isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}
                        >
                            <h3 className={`text-xl font-bold mb-2 flex items-center ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isCorrect ? <CheckCircle2 className="mr-2" /> : <XCircle className="mr-2" />}
                                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                            </h3>
                            {currentQuestion?.explanation && (
                                <p className="text-foreground text-sm leading-relaxed mb-6">
                                    {currentQuestion.explanation}
                                </p>
                            )}
                            <Button 
                                className="w-full rounded-xl py-6 font-bold" 
                                onClick={handleNext}
                            >
                                Siguiente
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
