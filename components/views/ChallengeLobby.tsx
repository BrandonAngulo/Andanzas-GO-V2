import React, { useEffect, useState } from 'react';
import { challengeService, GameChallenge } from '../../services/challenge.service';
import { gamesService } from '../../services/games.service';
import { Button } from '../ui/button';
import { Swords, Trophy, Clock, XCircle, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import GameInstructionsDialog from '../shared/GameInstructionsDialog';

export const ChallengeLobby: React.FC<{ challengeId: string; onClose: () => void; onAccept: (gameId: string, challengeId: string) => void; isAuthenticated?: boolean }> = ({ challengeId, onClose, onAccept, isAuthenticated = true }) => {
    const [challenge, setChallenge] = useState<GameChallenge | null>(null);
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const c = await challengeService.getChallenge(challengeId);
            if (c) {
                setChallenge(c);
                const g = await gamesService.getGameById(c.game_id);
                setGame(g);
            }
            setLoading(false);
        };
        load();
    }, [challengeId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <Swords className="w-12 h-12 text-primary mb-4 animate-bounce" />
                    <p className="text-lg font-medium">Cargando Reto...</p>
                </div>
            </div>
        );
    }

    if (!challenge || !game) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-border">
                    <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Reto no encontrado</h3>
                    <p className="text-muted-foreground mb-6">El enlace puede haber expirado o es incorrecto.</p>
                    <Button onClick={onClose} className="w-full">Volver al inicio</Button>
                </div>
            </div>
        );
    }

    if (challenge.status === 'completed') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-border">
                    <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Este reto ya terminó</h3>
                    <p className="text-muted-foreground mb-6">Alguien ya completó este reto. ¡Inicia uno nuevo tú mismo!</p>
                    <Button onClick={() => window.location.hash = `#/challenge/${challenge.id}/verdict`} className="w-full mb-3 font-bold">Ver Resultados</Button>
                    <Button variant="outline" onClick={onClose} className="w-full">Volver al inicio</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-4 sm:p-8">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-border rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
                
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-background z-10 relative">
                    <Swords className="w-10 h-10 text-primary" />
                </div>

                <h1 className="text-3xl font-extrabold mb-2 tracking-tight">¡Has sido retado!</h1>
                <p className="text-muted-foreground mb-6">
                    Andanzas GO es tu plataforma para explorar la historia y cultura a través de misiones y trivias. 
                    Un jugador te ha desafiado a una batalla de conocimientos. Demuestra que sabes más, supéralo en tiempo y precisión, ¡y súmate al Salón de la Fama!
                </p>

                <div className="bg-muted/30 rounded-2xl p-5 mb-8 border border-border/50 text-left relative">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                        onClick={() => setShowInstructions(true)}
                        title="Cómo Jugar"
                    >
                        <Info className="w-5 h-5" />
                    </Button>
                    <div className="pr-10">
                        <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Juego a disputar</div>
                        <div className="text-lg font-bold text-foreground mb-1 line-clamp-1">{game.title}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" /> Partida rápida
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <Button 
                        size="lg" 
                        className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group flex items-center justify-center"
                        onClick={() => onAccept(game.id, challenge.id)}
                    >
                        {isAuthenticated ? (
                            <>Aceptar Reto <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                        ) : (
                            <>Crear cuenta para jugar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full h-14 text-lg font-semibold rounded-xl"
                        onClick={onClose}
                    >
                        No por ahora
                    </Button>
                </div>
            </motion.div>

            {showInstructions && (
                <GameInstructionsDialog 
                    open={showInstructions}
                    onOpenChange={setShowInstructions}
                    game={game}
                />
            )}
        </div>
    );
};
