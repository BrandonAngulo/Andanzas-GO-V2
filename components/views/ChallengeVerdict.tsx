import React, { useEffect, useState } from 'react';
import { challengeService, GameChallenge } from '../../services/challenge.service';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../ui/button';
import { Swords, Trophy, Clock, XCircle, Target, Share2, Map, Hourglass, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Veredicto del Duelo: lee el resultado YA RESUELTO en servidor (winner_id + correctas/puntaje/tiempo).
export const ChallengeVerdict: React.FC<{ challengeId: string; onClose: () => void }> = ({ challengeId, onClose }) => {
    const [challenge, setChallenge] = useState<GameChallenge | null>(null);
    const [challengerUser, setChallengerUser] = useState<any>(null);
    const [challengedUser, setChallengedUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const c = await challengeService.getChallenge(challengeId);
            if (c) {
                setChallenge(c);
                const [u1, u2] = await Promise.all([
                    supabase.from('user_profiles').select('*').eq('id', c.challenger_id).maybeSingle(),
                    c.challenged_id ? supabase.from('user_profiles').select('*').eq('id', c.challenged_id).maybeSingle() : Promise.resolve({ data: null } as any),
                ]);
                setChallengerUser(u1.data);
                setChallengedUser(u2.data);
            }
            setLoading(false);
        })();
    }, [challengeId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <Trophy className="w-12 h-12 text-primary mb-4 animate-bounce" />
                    <p className="text-lg font-medium">Calculando veredicto…</p>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-border">
                    <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Veredicto no disponible</h3>
                    <p className="text-muted-foreground mb-6">El reto no existe o hubo un error.</p>
                    <Button onClick={onClose} className="w-full">Volver al inicio</Button>
                </div>
            </div>
        );
    }

    // Estados no resueltos.
    if (challenge.status !== 'completed') {
        const msg = challenge.status === 'cancelled' ? 'El retador canceló este duelo.'
            : challenge.status === 'expired' ? 'Este duelo venció.'
            : challenge.status === 'awaiting_opponent' ? 'El retador ya jugó. ¡Falta que su rival complete el duelo!'
            : 'El duelo aún no termina.';
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-border">
                    <Hourglass className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Duelo en curso</h3>
                    <p className="text-muted-foreground mb-6">{msg}</p>
                    <Button onClick={onClose} className="w-full">Volver</Button>
                </div>
            </div>
        );
    }

    const winner: 'challenger' | 'challenged' | 'tie' = !challenge.winner_id
        ? 'tie'
        : (challenge.winner_id === challenge.challenger_id ? 'challenger' : 'challenged');
    const fmtTime = (ms?: number | null) => `${Math.round((ms || 0) / 1000)}s`;

    const handleInvite = async () => {
        const text = `¡Terminé un duelo en Andanzas GO! Únete y explora nuestra cultura mientras juegas trivias.`;
        try {
            if (navigator.share) await navigator.share({ title: 'Andanzas GO', text, url: window.location.origin });
            else { await navigator.clipboard.writeText(`${text}\n\n${window.location.origin}`); toast.success('¡Enlace copiado!'); }
        } catch { /* cancelado */ }
    };

    const Side = ({ label, user, correct, score, time, isWinner }: { label: string; user: any; correct?: number | null; score?: number | null; time?: number | null; isWinner: boolean; }) => (
        <div className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${isWinner ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-card border-border/50 opacity-80'}`}>
            <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mb-3">
                {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">{label[0]}</div>}
            </div>
            <div className="font-bold mb-1 truncate w-full px-2">{label}</div>
            <div className="text-3xl font-black text-foreground">{correct ?? 0}<span className="text-sm text-muted-foreground font-bold">/{(challenge.ruleset?.question_count) ?? 10}</span></div>
            <div className="text-xs text-muted-foreground mb-3">correctas</div>
            <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /><span>{score ?? 0} pts</span></div>
                <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg"><Clock className="w-4 h-4 text-muted-foreground" /><span>{fmtTime(time)}</span></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-xl mx-auto w-full flex flex-col py-8 space-y-8">
                <div className="text-center">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="inline-flex items-center justify-center w-24 h-24 bg-yellow-500/10 rounded-full mb-4 ring-8 ring-yellow-500/5">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight">{winner === 'tie' ? '¡Es un empate!' : '¡Reto concluido!'}</h1>
                    <p className="text-muted-foreground mt-3 font-medium px-4">Gana quien más acierta; luego el puntaje y, por último, el menor tiempo.</p>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <Side label="Retador" user={challengerUser} correct={challenge.challenger_correct} score={challenge.challenger_score} time={challenge.challenger_time_ms} isWinner={winner === 'challenger'} />
                    <div className="flex flex-col items-center justify-center text-muted-foreground px-2"><Swords className="w-8 h-8 mb-1 opacity-50" /><span className="text-xs font-bold uppercase tracking-widest">VS</span></div>
                    <Side label="Retado" user={challengedUser} correct={challenge.challenged_correct} score={challenge.challenged_score} time={challenge.challenged_time_ms} isWinner={winner === 'challenged'} />
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <Button className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={onClose}><Map className="w-5 h-5 mr-2" /> Explorar Andanzas GO</Button>
                    <Button variant="outline" className="w-full h-14 rounded-xl text-lg font-bold border-2" onClick={handleInvite}><Share2 className="w-5 h-5 mr-2" /> Invitar a más amigos</Button>
                </div>
            </div>
        </div>
    );
};
