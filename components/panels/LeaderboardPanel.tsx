import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Shield, Sparkles, Star, Trophy } from 'lucide-react';
import { gamificationService } from '../../services/gamification.service';
import { UserAvatar } from '../shared/UserAvatar';

const podiumStyle = [
    'from-amber-300 via-yellow-400 to-orange-500 ring-amber-300/50 md:order-2 md:-translate-y-5',
    'from-slate-200 via-slate-300 to-slate-500 ring-slate-300/50 md:order-1',
    'from-orange-300 via-amber-600 to-orange-800 ring-orange-400/40 md:order-3',
];

export const LeaderboardPanel: React.FC = () => {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        gamificationService.getGlobalLeaderboard(10).then(setLeaders).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-20 text-center font-semibold text-purple-700 animate-pulse">Preparando el Salón de la Fama...</div>;

    if (leaders.length === 0) return (
        <div className="rounded-[2rem] border border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-amber-50 py-20 text-center">
            <Shield className="mx-auto mb-4 h-16 w-16 text-purple-300" />
            <h3 className="text-xl font-black">Aún no hay leyendas</h3>
            <p className="mt-2 text-muted-foreground">El podio está esperando a sus primeros grandes exploradores.</p>
        </div>
    );

    return (
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1d0b4f] via-[#53158c] to-[#9a3412] p-5 text-white shadow-2xl md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_18%),radial-gradient(circle_at_80%_0%,#fbbf24_0,transparent_22%)]" />
            <header className="relative mb-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-purple-950 shadow-lg shadow-amber-400/30"><Trophy className="h-8 w-8" /></div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Leyendas de Andanzas</p>
                <h2 className="mt-2 text-3xl font-black md:text-4xl">Salón de la Fama</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-white/75">Quienes más juegan, aprenden y demuestran cuánto saben de la ciudad.</p>
            </header>

            <div className="relative mb-8 grid gap-4 md:grid-cols-3 md:items-end">
                {leaders.slice(0, 3).map((leader, index) => (
                    <motion.article key={leader.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.12 }} className={`rounded-3xl bg-gradient-to-br p-[2px] ring-4 ${podiumStyle[index]}`}>
                        <div className="relative flex min-h-48 flex-col items-center rounded-[calc(1.5rem-2px)] bg-purple-950/90 px-4 py-6 text-center backdrop-blur">
                            {index === 0 ? <Crown className="absolute -top-7 h-10 w-10 text-amber-300 drop-shadow-lg" /> : <Medal className="absolute -top-5 h-8 w-8 text-white/85" />}
                            <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border-4 border-white/70 shadow-xl"><UserAvatar userProfile={leader} className="h-full w-full" /></div>
                            <span className="mb-1 text-xs font-black uppercase tracking-widest text-amber-300">Puesto {index + 1}</span>
                            <h3 className="max-w-full truncate text-lg font-black">{leader.full_name || 'Explorador anónimo'}</h3>
                            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2"><Star className="h-4 w-4 fill-amber-300 text-amber-300" /><strong>{leader.total_points || 0}</strong><span className="text-xs text-white/65">puntos</span></div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {leaders.length > 3 && <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
                {leaders.slice(3).map((leader, offset) => <div key={leader.id} className="flex items-center gap-3 border-b border-white/10 p-3 last:border-0 hover:bg-white/5">
                    <span className="w-8 text-center text-lg font-black text-amber-300">{offset + 4}</span>
                    <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/30"><UserAvatar userProfile={leader} className="h-full w-full" /></div>
                    <span className="min-w-0 flex-1 truncate font-bold">{leader.full_name || 'Explorador anónimo'}</span>
                    <span className="flex items-center gap-1 rounded-full bg-purple-950/50 px-3 py-1.5 text-sm font-bold"><Sparkles className="h-3.5 w-3.5 text-amber-300" />{leader.total_points || 0}</span>
                </div>)}
            </div>}
        </section>
    );
};
