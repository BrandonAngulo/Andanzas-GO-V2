import React, { useEffect, useState } from 'react';
import { Brain, Coins, Gem, Globe2, Heart, HelpCircle, Loader2, Play, RotateCcw, Sparkles, Target, Trophy } from 'lucide-react';
import { gamificationService, type EconomySummary } from '../../../services/gamification.service';
import { gamesService, type Game, type GameModeSessionSummary } from '../../../services/games.service';
import { Button } from '../../ui/button';
import { InfoTooltip } from '../../ui/tooltip';
import { ModeLobbyShell } from './ModeLobbyShell';

interface Props {
    game: Game;
    onClose: () => void;
    onPlay: () => void;
}

export const ClassicModeHub: React.FC<Props> = ({ game, onClose, onPlay }) => {
    const [summary, setSummary] = useState<GameModeSessionSummary | null>(null);
    const [economy, setEconomy] = useState<EconomySummary | null>(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        void Promise.allSettled([
            gamesService.getMyGameModeSummary(game.id, 'clasica'),
            gamificationService.getEconomySummary(),
            gamesService.getPublishedQuestionCount(game.id),
        ]).then(([modeSummary, economySummary, published]) => {
            if (!alive) return;
            if (modeSummary.status === 'fulfilled') setSummary(modeSummary.value);
            if (economySummary.status === 'fulfilled') setEconomy(economySummary.value);
            if (published.status === 'fulfilled') setQuestionCount(published.value);
        }).finally(() => {
            if (alive) setLoading(false);
        });
        return () => { alive = false; };
    }, [game.id]);

    const perRound = game.questions_per_match || 15;
    const overallAccuracy = summary && summary.total_answered > 0
        ? Math.round((summary.total_correct / summary.total_answered) * 100)
        : 0;

    return <ModeLobbyShell eyebrow="TRIVIA GO · Antesala de modo" title="Partida clásica" subtitle="Revisa tu recorrido y comienza cuando estés listo." onClose={onClose}>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
            <div className="space-y-3">
                <section className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#063f46] via-[#08705d] to-[#17a875] px-5 py-5 text-white shadow-xl sm:px-7 sm:py-6">
                    <Globe2 className="absolute -right-9 -top-12 h-56 w-56 text-white/[0.07]" />
                    <div className="relative z-10 grid items-center gap-3 sm:grid-cols-[1fr_9rem]">
                        <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-amber-950"><Sparkles className="h-3 w-3" /> El banco completo</span>
                            <h2 className="mt-2 text-3xl font-black leading-none sm:text-4xl">Una ronda.<br />Todo el banco.</h2>
                            <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/75 sm:text-sm">Mezcla temas, formatos, categorías y territorios en una partida general distinta cada vez.</p>
                        </div>
                        <img src="/brand/andi/andi-app-mark-512.png" alt="Andi te invita a una partida clásica" className="mx-auto hidden h-32 w-32 rounded-full object-cover shadow-2xl ring-4 ring-white/20 sm:block" />
                    </div>
                </section>

                <section className="grid grid-cols-3 gap-2">
                    <Rule icon={<Target />} value={String(perRound)} label="preguntas" />
                    <Rule icon={<Brain />} value={questionCount ? questionCount.toLocaleString('es-CO') : '—'} label="en el banco" />
                    <Rule icon={<RotateCcw />} value="Siempre" label="puedes repetir" />
                </section>

                <section className="rounded-2xl border border-emerald-900/10 bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2"><div><p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700">Así se juega</p><h3 className="text-sm font-black">Reglas claras antes de empezar</h3></div><HelpCircle className="h-5 w-5 text-emerald-600" /></div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <Copy title="Avanza a tu ritmo" body="Cada pregunta usa su propio tiempo. La ronda no tiene un reloj global." />
                        <Copy title="Suma por acertar" body="Los aciertos, la rapidez y las rachas construyen tu puntaje final." />
                        <Copy title="Aprende al responder" body="Después de cada respuesta puedes revisar la explicación disponible." />
                    </div>
                </section>
            </div>

            <aside className="space-y-3">
                <section className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-lg">
                    <div className="flex items-center justify-between"><div><p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700">Tu historial clásico</p><h3 className="text-lg font-black">Tu mejor recorrido</h3></div>{loading ? <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> : <Trophy className="h-6 w-6 text-amber-500" />}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <Metric value={loading ? '…' : String(summary?.completed || 0)} label="completadas" />
                        <Metric value={loading ? '…' : (summary?.best_score || 0).toLocaleString('es-CO')} label="mejor puntaje" />
                        <Metric value={loading ? '…' : `${overallAccuracy}%`} label="precisión total" />
                        <Metric value={loading ? '…' : String(summary?.best_streak || 0)} label="mejor racha" />
                    </div>
                    {!loading && !summary?.completed ? <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-900">Tu historial comenzará con la primera partida clásica que completes desde esta actualización.</p> : null}
                </section>

                <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-center justify-between gap-2"><div><p className="text-[8px] font-black uppercase tracking-wide text-emerald-700">Tus recursos reales</p><h3 className="text-sm font-black text-emerald-950">Saldo de TRIVIA GO</h3></div><InfoTooltip title="Recursos en Partida clásica" body="Comenzar no descuenta monedas, gemas ni vidas. Al terminar, el servidor calcula las recompensas generales según tu resultado."><button type="button" aria-label="Cómo se usan los recursos" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow"><HelpCircle className="h-4 w-4" /></button></InfoTooltip></div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        <Balance icon={<Coins />} value={loading ? '…' : String(economy?.coins ?? '—')} label="monedas" color="amber" />
                        <Balance icon={<Gem />} value={loading ? '…' : String(economy?.gems ?? '—')} label="gemas" color="cyan" />
                        <Balance icon={<Heart />} value={loading ? '…' : economy ? `${economy.lives}/${economy.max_lives}` : '—'} label="vidas" color="rose" />
                    </div>
                    <p className="mt-2 text-center text-[9px] font-semibold text-emerald-800/70">Entrar a esta modalidad no consume recursos.</p>
                </section>

                <Button onClick={onPlay} className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-black text-white shadow-lg hover:from-emerald-500 hover:to-teal-500">Comenzar partida clásica <Play className="ml-2 h-4 w-4 fill-current" /></Button>
                <p className="text-center text-[9px] text-slate-500">{game.title} · selección variada del banco publicado</p>
            </aside>
        </div>
    </ModeLobbyShell>;
};

const Rule = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => <div className="rounded-xl border border-emerald-900/10 bg-white px-2 py-3 text-center shadow-sm"><span className="mx-auto flex h-6 w-6 items-center justify-center text-emerald-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span><strong className="mt-1 block truncate text-sm font-black text-[#073c43]">{value}</strong><span className="block text-[7px] font-black uppercase tracking-wide text-slate-500">{label}</span></div>;
const Copy = ({ title, body }: { title: string; body: string }) => <div className="rounded-xl bg-emerald-50/70 px-3 py-2"><strong className="block text-[11px] text-emerald-950">{title}</strong><p className="mt-0.5 text-[9px] leading-relaxed text-slate-600">{body}</p></div>;
const Metric = ({ value, label }: { value: string; label: string }) => <div className="rounded-xl bg-slate-50 px-2 py-2.5 text-center"><strong className="block truncate text-lg font-black text-[#073c43]">{value}</strong><span className="text-[7px] font-black uppercase tracking-wide text-slate-500">{label}</span></div>;

const BALANCE_TONES = { amber: 'bg-amber-100 text-amber-700', cyan: 'bg-cyan-100 text-cyan-700', rose: 'bg-rose-100 text-rose-700' } as const;
const Balance = ({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: keyof typeof BALANCE_TONES }) => <div className="rounded-xl bg-white p-2 text-center shadow-sm"><span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4 ${BALANCE_TONES[color]}`}>{icon}</span><strong className="mt-1 block truncate text-xs font-black text-emerald-950">{value}</strong><span className="block text-[7px] font-black uppercase text-emerald-700/70">{label}</span></div>;
