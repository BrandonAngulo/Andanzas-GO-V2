import React, { useEffect, useState } from 'react';
import { challengeService, GameChallenge } from '../../services/challenge.service';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../ui/button';
import { Swords, Trophy, Clock, XCircle, ArrowLeft, Star, Target, Share2, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const ChallengeVerdict: React.FC<{ challengeId: string; onClose: () => void }> = ({ challengeId, onClose }) => {
    const [challenge, setChallenge] = useState<GameChallenge | null>(null);
    const [challengerSession, setChallengerSession] = useState<any>(null);
    const [challengedSession, setChallengedSession] = useState<any>(null);
    const [challengerUser, setChallengerUser] = useState<any>(null);
    const [challengedUser, setChallengedUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const c = await challengeService.getChallenge(challengeId);
            if (c) {
                setChallenge(c);
                
                // Fetch sessions
                const [s1, s2] = await Promise.all([
                    supabase.from('game_sessions').select('*').eq('id', c.challenger_session_id).single(),
                    c.challenged_session_id ? supabase.from('game_sessions').select('*').eq('id', c.challenged_session_id).single() : Promise.resolve({ data: null })
                ]);
                
                setChallengerSession(s1.data);
                setChallengedSession(s2.data);

                // Fetch user info (just email or basic profile for now)
                const [u1, u2] = await Promise.all([
                    supabase.from('user_profiles').select('*').eq('id', c.challenger_id).single(),
                    c.challenged_id ? supabase.from('user_profiles').select('*').eq('id', c.challenged_id).single() : Promise.resolve({ data: null })
                ]);
                setChallengerUser(u1.data);
                setChallengedUser(u2.data);
            }
            setLoading(false);
        };
        load();
    }, [challengeId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <Trophy className="w-12 h-12 text-primary mb-4 animate-bounce" />
                    <p className="text-lg font-medium">Calculando Veredicto...</p>
                </div>
            </div>
        );
    }

    if (!challenge || !challengerSession || !challengedSession) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-border">
                    <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Veredicto no disponible</h3>
                    <p className="text-muted-foreground mb-6">El reto no se ha completado o hubo un error.</p>
                    <Button onClick={onClose} className="w-full">Volver al inicio</Button>
                </div>
            </div>
        );
    }

    // Determine winner
    let winner = 'tie';
    if (challengerSession.total_score > challengedSession.total_score) {
        winner = 'challenger';
    } else if (challengedSession.total_score > challengerSession.total_score) {
        winner = 'challenged';
    } else {
        // Tie breaker by time
        if (challengerSession.total_time_ms < challengedSession.total_time_ms) {
            winner = 'challenger';
        } else if (challengedSession.total_time_ms < challengerSession.total_time_ms) {
            winner = 'challenged';
        }
    }

    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        return `${s}s`;
    };

    const handleInvite = async () => {
        const text = `¡He terminado un reto épico en Andanzas GO! Únete y explora nuestra cultura mientras juegas trivias.`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Andanzas GO', text, url: window.location.origin });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            await navigator.clipboard.writeText(`${text}\n\n${window.location.origin}`);
            toast.success("¡Enlace copiado al portapapeles!");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-xl mx-auto w-full flex flex-col py-8 space-y-8">
                <div className="text-center">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-yellow-500/10 rounded-full mb-4 ring-8 ring-yellow-500/5"
                    >
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        {winner === 'tie' ? '¡Es un Empate!' : '¡Reto Concluido!'}
                    </h1>
                    <p className="text-muted-foreground mt-3 font-medium px-4">
                        {winner === 'challenger' 
                            ? 'Estuviste cerca. ¡No te rindas! Reta a alguien más para recuperar tu honor o vuelve a intentarlo.' 
                            : winner === 'challenged'
                            ? '¡Increíble! Demostraste ser el mejor. Sigue así y reta a más amigos para dominar el salón de la fama.'
                            : '¡Vaya duelo de titanes! Ambos son unos expertos. ¿Qué tal si desempatan con otra ronda?'}
                    </p>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    {/* Challenger */}
                    <div className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${winner === 'challenger' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-card border-border/50 opacity-80'}`}>
                        <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mb-3">
                            {challengerUser?.avatar_url ? (
                                <img src={challengerUser.avatar_url} alt="P1" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">P1</div>
                            )}
                        </div>
                        <div className="font-bold mb-1 truncate w-full px-2">Retador</div>
                        <div className="text-3xl font-black text-foreground mb-4">{challengerSession.total_score}</div>
                        
                        <div className="w-full space-y-2 text-sm">
                            <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span>{challengerSession.accuracy_percent.toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{formatTime(challengerSession.total_time_ms)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-muted-foreground px-2">
                        <Swords className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest">VS</span>
                    </div>

                    {/* Challenged */}
                    <div className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${winner === 'challenged' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-card border-border/50 opacity-80'}`}>
                        <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mb-3">
                            {challengedUser?.avatar_url ? (
                                <img src={challengedUser.avatar_url} alt="P2" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">P2</div>
                            )}
                        </div>
                        <div className="font-bold mb-1 truncate w-full px-2">Tú</div>
                        <div className="text-3xl font-black text-foreground mb-4">{challengedSession.total_score}</div>
                        
                        <div className="w-full space-y-2 text-sm">
                            <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span>{challengedSession.accuracy_percent.toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{formatTime(challengedSession.total_time_ms)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <Button 
                        className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" 
                        onClick={onClose}
                    >
                        <Map className="w-5 h-5 mr-2" /> Explorar Andanzas GO
                    </Button>
                    <Button 
                        variant="outline"
                        className="w-full h-14 rounded-xl text-lg font-bold border-2" 
                        onClick={handleInvite}
                    >
                        <Share2 className="w-5 h-5 mr-2" /> Invitar a más amigos
                    </Button>
                </div>
            </div>
        </div>
    );
};
