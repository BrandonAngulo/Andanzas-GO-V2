import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Hourglass, Map, Share2, Swords, TimerOff, Trophy, X, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { challengeService, type GameChallenge } from '../../services/challenge.service';
import { Button } from '../ui/button';

export const ChallengeVerdict: React.FC<{ challengeId: string; onClose: () => void }> = ({ challengeId, onClose }) => {
    const [challenge, setChallenge] = useState<GameChallenge | null>(null);
    const [challengerUser, setChallengerUser] = useState<any>(null);
    const [challengedUser, setChallengedUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        let alive = true;
        void (async () => {
            const current = await challengeService.getChallenge(challengeId);
            if (!alive) return;
            if (current) {
                setChallenge(current);
                const [challenger, challenged] = await Promise.all([
                    supabase.from('user_profiles').select('*').eq('id', current.challenger_id).maybeSingle(),
                    current.challenged_id ? supabase.from('user_profiles').select('*').eq('id', current.challenged_id).maybeSingle() : Promise.resolve({ data: null } as any),
                ]);
                if (alive) {
                    setChallengerUser(challenger.data);
                    setChallengedUser(challenged.data);
                }
            }
            if (alive) setLoading(false);
        })();
        return () => { alive = false; };
    }, [challengeId]);

    if (loading) return <CenteredState icon={<Trophy className="h-11 w-11 animate-bounce text-violet-600" />} text="Calculando veredicto…" />;
    if (!challenge) return <CenteredState icon={<XCircle className="h-11 w-11 text-red-500" />} text="El veredicto no está disponible." action={<Button onClick={onClose}>Volver</Button>} />;

    if (challenge.status !== 'completed') {
        const message = challenge.status === 'cancelled' ? 'El retador canceló este duelo.'
            : challenge.status === 'expired' ? 'Este duelo venció.'
            : challenge.status === 'awaiting_opponent' ? 'El retador ya jugó. Falta que su rival complete el duelo.'
            : 'El duelo aún no termina.';
        return <CenteredState icon={<Hourglass className="h-11 w-11 text-violet-600" />} text={message} action={<Button onClick={onClose}>Volver</Button>} />;
    }

    const winner: 'challenger' | 'challenged' | 'tie' = !challenge.winner_id ? 'tie' : challenge.winner_id === challenge.challenger_id ? 'challenger' : 'challenged';
    const decidedByForfeit = !!challenge.challenger_forfeited || !!challenge.challenged_forfeited;
    const questionCount = challenge.ruleset?.question_count ?? 10;

    const handleInvite = async () => {
        const text = '¡Terminé un duelo en Andanzas GO! Únete y explora nuestra cultura mientras juegas.';
        try {
            if (navigator.share) await navigator.share({ title: 'Andanzas GO', text, url: window.location.origin });
            else {
                await navigator.clipboard.writeText(`${text}\n\n${window.location.origin}`);
                toast.success('¡Enlace copiado!');
            }
        } catch { /* compartir cancelado */ }
    };

    return <div className="fixed inset-0 z-[10050] overflow-y-auto bg-gradient-to-b from-violet-50 to-white p-4 text-slate-900 sm:p-6" style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}>
        <div className="mx-auto flex w-full max-w-xl flex-col space-y-5">
            <div className="flex items-center justify-between"><CircleButton label="Volver" onClick={onClose}><ArrowLeft className="h-5 w-5" /></CircleButton><span className="text-[9px] font-black uppercase tracking-[0.18em] text-violet-700">Veredicto del duelo</span><CircleButton label="Cerrar" onClick={onClose}><X className="h-5 w-5" /></CircleButton></div>

            <div className="text-center">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className={`mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full ring-8 ${decidedByForfeit ? 'bg-red-500/10 text-red-500 ring-red-500/5' : 'bg-yellow-500/10 text-yellow-500 ring-yellow-500/5'}`}>{decidedByForfeit ? <TimerOff className="h-10 w-10" /> : <Trophy className="h-10 w-10" />}</motion.div>
                <h1 className="text-3xl font-extrabold tracking-tight">{winner === 'tie' ? '¡Es un empate!' : '¡Reto concluido!'}</h1>
                <p className="mt-2 px-4 text-sm font-medium text-muted-foreground">{decidedByForfeit ? 'El tiempo agotado o el abandono decide primero el resultado.' : 'Gana quien más acierta; luego el puntaje y, por último, el menor tiempo.'}</p>
            </div>

            <div className="relative grid grid-cols-2 items-stretch gap-3">
                <PlayerSide label="Retador" user={challengerUser} correct={challenge.challenger_correct} score={challenge.challenger_score} time={challenge.challenger_time_ms} total={questionCount} isWinner={winner === 'challenger'} forfeited={challenge.challenger_forfeited} />
                <span className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow"><Swords className="h-4 w-4" /></span>
                <PlayerSide label="Retado" user={challengedUser} correct={challenge.challenged_correct} score={challenge.challenged_score} time={challenge.challenged_time_ms} total={questionCount} isWinner={winner === 'challenged'} forfeited={challenge.challenged_forfeited} />
            </div>

            <div className="flex flex-col gap-2"><Button className="h-11 w-full rounded-xl bg-violet-600 font-bold text-white shadow-lg hover:bg-violet-500" onClick={onClose}><Map className="mr-2 h-5 w-5" /> Explorar Andanzas GO</Button><Button variant="outline" className="h-11 w-full rounded-xl border-2 font-bold" onClick={handleInvite}><Share2 className="mr-2 h-5 w-5" /> Invitar a más amigos</Button></div>
        </div>
    </div>;
};

const PlayerSide = ({ label, user, correct, score, time, total, isWinner, forfeited }: { label: string; user: any; correct?: number | null; score?: number | null; time?: number | null; total: number; isWinner: boolean; forfeited?: boolean }) => <div className={`flex flex-col items-center rounded-2xl border-2 p-3 text-center ${isWinner ? 'border-violet-500 bg-violet-50 shadow-lg' : 'border-slate-200 bg-white opacity-85'}`}>
    {forfeited ? <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-red-600"><TimerOff className="h-3 w-3" /> Ronda no completada</span> : null}
    <div className="mb-2 h-14 w-14 overflow-hidden rounded-full bg-violet-600">{user?.avatar_url ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-bold text-white">{label[0]}</div>}</div>
    <div className="w-full truncate px-2 font-bold">{label}</div>
    <div className="text-2xl font-black">{correct ?? 0}<span className="text-xs font-bold text-muted-foreground">/{total}</span></div>
    <div className="mb-2 text-[9px] uppercase tracking-wide text-muted-foreground">correctas</div>
    <div className="w-full space-y-1.5 text-xs"><div className="flex items-center justify-between rounded-lg bg-slate-50 p-2"><CheckCircle2 className="h-4 w-4 text-slate-400" /><span>{score ?? 0} pts</span></div><div className="flex items-center justify-between rounded-lg bg-slate-50 p-2"><Clock className="h-4 w-4 text-slate-400" /><span>{Math.round((time || 0) / 1000)}s</span></div></div>
</div>;

const CircleButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) => <button type="button" onClick={onClick} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow">{children}</button>;

const CenteredState = ({ icon, text, action }: { icon: React.ReactNode; text: string; action?: React.ReactNode }) => <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-white p-4"><div className="flex max-w-sm flex-col items-center gap-4 text-center">{icon}<p className="font-medium text-slate-600">{text}</p>{action}</div></div>;
