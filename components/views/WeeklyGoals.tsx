import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { weeklyService, WeeklyGoal } from '../../services/weekly.service';
import { Target, Coins, Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { WeeklyGoalRewardModal } from './WeeklyGoalRewardModal';

// Metas semanales flexibles (manual §4.2): toleran ausencias, se reclaman al completar.
// Tarjeta compacta pensada para vivir dentro del panel de Juegos.
export const WeeklyGoals: React.FC = () => {
    const [goals, setGoals] = useState<WeeklyGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [reward, setReward] = useState<{ coins: number; title: string } | null>(null);
    const reduceMotion = useReducedMotion();

    const load = async () => {
        try { setGoals((await weeklyService.getWeeklyGoals()).goals); }
        catch { /* sin sesión o sin datos: la tarjeta simplemente no se muestra */ }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const claim = async (g: WeeklyGoal) => {
        if (claiming) return;
        setClaiming(g.key);
        try {
            const res = await weeklyService.claimWeeklyGoal(g.key);
            if (res.claimed) setReward({ coins: res.coins ?? g.reward_coins, title: g.title });
            else if (res.already_claimed) toast.info('Esta meta ya estaba reclamada.');
            await load();
        } catch { toast.error('No se pudo reclamar la meta.'); }
        finally { setClaiming(null); }
    };

    if (loading || goals.length === 0) return null;

    return (
        <div className="rounded-3xl border border-border/70 bg-card/80 p-4">
            <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Target className="h-4 w-4" /></span>
                <h3 className="text-sm font-bold">Metas de la semana</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {goals.map(g => {
                    const pct = Math.min(100, Math.round((g.progress / g.target) * 100));
                    return (
                        <div key={g.key} className="rounded-2xl bg-muted/40 p-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="text-sm font-bold leading-tight">{g.title}</div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">{g.description}</div>
                                </div>
                                <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-500"><Coins className="h-3.5 w-3.5" /> {g.reward_coins}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                    <div className={`h-full transition-[width] ${g.completed ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[11px] font-semibold text-muted-foreground">{g.progress}/{g.target}</span>
                            </div>
                            {g.claimed ? (
                                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><Check className="h-3.5 w-3.5" /> Reclamada</div>
                            ) : g.completed ? (
                                <motion.button
                                    type="button"
                                    disabled={claiming === g.key}
                                    onClick={() => claim(g)}
                                    animate={reduceMotion || claiming === g.key ? undefined : {
                                        scale: [1, 1.06, 1],
                                        boxShadow: [
                                            '0 0 0 0 rgba(245,158,11,0.45)',
                                            '0 0 16px 4px rgba(245,158,11,0.7)',
                                            '0 0 0 0 rgba(245,158,11,0.45)',
                                        ],
                                    }}
                                    transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                                    whileHover={{ scale: 1.09 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3.5 py-1 text-xs font-black text-white shadow-sm disabled:opacity-60"
                                >
                                    {claiming === g.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} ¡Reclamar premio!
                                </motion.button>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <WeeklyGoalRewardModal
                open={!!reward}
                onOpenChange={(open) => { if (!open) setReward(null); }}
                coins={reward?.coins ?? 0}
                goalTitle={reward?.title ?? ''}
            />
        </div>
    );
};
