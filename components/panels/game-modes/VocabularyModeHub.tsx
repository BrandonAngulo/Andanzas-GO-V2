import React, { useEffect, useState } from 'react';
import { BookOpenText, CheckCircle2, Coins, Gem, Heart, HelpCircle, Languages, Lightbulb, Loader2, MessageCircleQuestion, Play, RefreshCw, Shuffle, Sparkles, Trophy } from 'lucide-react';
import { gamificationService, type EconomySummary } from '../../../services/gamification.service';
import { gamesService, type Game, type GameModeSessionSummary, type ThemeQuestionStats, type UserCategoryProgress } from '../../../services/games.service';
import { Button } from '../../ui/button';
import { InfoTooltip } from '../../ui/tooltip';
import { ModeLobbyShell } from './ModeLobbyShell';

interface Props {
    game: Game;
    onClose: () => void;
    onPlay: () => void;
}

const EMPTY_STATS: ThemeQuestionStats = { total: 0, direct: 0, inverse: 0, trueFalse: 0, other: 0 };

export const VocabularyModeHub: React.FC<Props> = ({ game, onClose, onPlay }) => {
    const [progress, setProgress] = useState<UserCategoryProgress | null>(null);
    const [stats, setStats] = useState<ThemeQuestionStats>(EMPTY_STATS);
    const [summary, setSummary] = useState<GameModeSessionSummary | null>(null);
    const [economy, setEconomy] = useState<EconomySummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        void Promise.allSettled([
            gamesService.getMyCategoryProgress(game.id, 'Vocabulario'),
            gamesService.getThemeQuestionStats(game.id, 'vocabulario'),
            gamesService.getMyGameModeSummary(game.id, 'vocabulario', 'vocabulario'),
            gamificationService.getEconomySummary(),
        ]).then(([categoryProgress, questionStats, modeSummary, economySummary]) => {
            if (!alive) return;
            if (categoryProgress.status === 'fulfilled') setProgress(categoryProgress.value);
            if (questionStats.status === 'fulfilled') setStats(questionStats.value);
            if (modeSummary.status === 'fulfilled') setSummary(modeSummary.value);
            if (economySummary.status === 'fulfilled') setEconomy(economySummary.value);
        }).finally(() => {
            if (alive) setLoading(false);
        });
        return () => { alive = false; };
    }, [game.id]);

    const level = Math.max(1, Math.min(10, progress?.level || 1));
    const xp = progress?.xp || 0;
    const atMaxLevel = level >= 10;
    const levelXp = atMaxLevel ? 250 : xp % 250;
    const levelPercent = atMaxLevel ? 100 : Math.round((levelXp / 250) * 100);
    const accuracy = progress?.attempts ? Math.round((progress.correct_answers / progress.attempts) * 100) : 0;
    const exerciseTypes = [
        { icon: <BookOpenText />, label: 'Descubre el significado', count: stats.direct, tone: 'from-fuchsia-500 to-pink-500' },
        { icon: <Languages />, label: 'Encuentra la palabra', count: stats.inverse, tone: 'from-violet-500 to-indigo-500' },
        { icon: <CheckCircle2 />, label: 'Verdadero o falso', count: stats.trueFalse, tone: 'from-cyan-500 to-teal-500' },
    ];

    return <ModeLobbyShell eyebrow="TRIVIA GO · Antesala de modo" title="Vocabulario caleño" subtitle="Conoce tus retos y tu avance antes de practicar." onClose={onClose}>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
            <div className="space-y-3">
                <section className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#42136f] via-[#7525a9] to-[#d82c91] px-5 py-5 text-white shadow-xl sm:px-7 sm:py-6">
                    <div className="absolute -left-8 -top-10 h-36 w-36 rounded-full border-[18px] border-white/[0.06]" />
                    <div className="absolute right-28 top-5 rounded-full bg-white/10 px-3 py-1 text-sm font-black -rotate-6">¿Ve?</div>
                    <div className="absolute bottom-6 right-8 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-violet-950 rotate-6">¡De una!</div>
                    <MessageCircleQuestion className="absolute -right-7 -top-6 h-44 w-44 text-white/[0.06]" />
                    <div className="relative z-10 grid items-center gap-2 sm:grid-cols-[1fr_8rem]">
                        <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-violet-950"><Sparkles className="h-3 w-3" /> Habla como en Cali</span>
                            <h2 className="mt-2 text-3xl font-black leading-none sm:text-4xl">Palabras que<br />también cuentan historias.</h2>
                            <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">Practica significados y expresiones del habla caleña con combinaciones distintas en cada ronda.</p>
                        </div>
                        <img src="/brand/andi/andi-app-mark-512.png" alt="Andi te invita a practicar vocabulario caleño" className="mx-auto hidden h-28 w-28 rounded-full object-cover shadow-2xl ring-4 ring-white/20 sm:block" />
                    </div>
                </section>

                <section className="grid grid-cols-3 gap-2">
                    {exerciseTypes.map(item => <div key={item.label} className="overflow-hidden rounded-xl border border-violet-900/10 bg-white shadow-sm">
                        <div className={`flex h-8 items-center gap-1.5 bg-gradient-to-r ${item.tone} px-2 text-white`}><span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span><strong className="truncate text-[9px] sm:text-[10px]">{item.label}</strong></div>
                        <div className="px-2 py-2 text-center"><strong className="block text-lg font-black text-[#42136f]">{loading ? '…' : item.count}</strong><span className="text-[7px] font-black uppercase tracking-wide text-slate-500">retos disponibles</span></div>
                    </div>)}
                </section>

                <section className="rounded-2xl border border-violet-900/10 bg-white/90 p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                        <div><p className="text-[8px] font-black uppercase tracking-[0.16em] text-fuchsia-700">Tu próxima práctica</p><h3 className="text-sm font-black">{loading ? 'Preparando tus retos…' : `${stats.total.toLocaleString('es-CO')} retos para seguir descubriendo palabras`}</h3></div>
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-fuchsia-600" /> : <Sparkles className="h-5 w-5 text-fuchsia-600" />}
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <PracticeBenefit icon={<Shuffle />} title="Cada ronda cambia" body="Se mezclan palabras y tipos de reto para que siempre tengas algo por descubrir." />
                        <PracticeBenefit icon={<Lightbulb />} title="Aprendes al responder" body="Las explicaciones te ayudan a entender el uso y el significado de cada expresión." />
                        <PracticeBenefit icon={<RefreshCw />} title="Practica cuantas veces quieras" body="Vuelve a jugar para mejorar tus aciertos y fortalecer tu avance." />
                    </div>
                </section>
            </div>

            <aside className="space-y-3">
                <section className="rounded-2xl border border-violet-900/10 bg-white p-4 shadow-lg">
                    <div className="flex items-center justify-between gap-2"><div><p className="text-[8px] font-black uppercase tracking-[0.16em] text-fuchsia-700">Tu avance</p><h3 className="text-lg font-black">Nivel {level} de 10</h3></div>{loading ? <Loader2 className="h-5 w-5 animate-spin text-fuchsia-600" /> : <Trophy className="h-6 w-6 text-amber-500" />}</div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all" style={{ width: `${levelPercent}%` }} /></div>
                    <div className="mt-1 flex justify-between text-[8px] font-bold text-slate-500"><span>{atMaxLevel ? 'Dominio máximo alcanzado' : `${levelXp}/250 XP del nivel`}</span><span>{levelPercent}%</span></div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <Metric value={loading ? '…' : String(progress?.attempts || 0)} label="respondidas" />
                        <Metric value={loading ? '…' : `${accuracy}%`} label="tus aciertos" />
                        <Metric value={loading ? '…' : `${Math.round((progress?.mastery || 0) * 100)}%`} label="avance reciente" />
                    </div>
                    {!loading && !progress ? <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-900">Tu recorrido comenzará con la primera respuesta de vocabulario. Cada intento alimentará este progreso.</p> : null}
                    <p className="mt-2 text-[9px] text-slate-500">Partidas completadas en esta modalidad: <strong className="text-violet-900">{loading ? '…' : summary?.completed || 0}</strong></p>
                </section>

                <section className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-3">
                    <div className="flex items-center justify-between gap-2"><div><p className="text-[8px] font-black uppercase tracking-wide text-fuchsia-700">Tus recursos</p><h3 className="text-sm font-black text-violet-950">Saldo de TRIVIA GO</h3></div><InfoTooltip title="Recursos en Vocabulario" body="Comenzar no descuenta monedas, gemas ni vidas. Al terminar puedes recibir recompensas según tu resultado."><button type="button" aria-label="Cómo se usan los recursos" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-fuchsia-700 shadow"><HelpCircle className="h-4 w-4" /></button></InfoTooltip></div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        <Balance icon={<Coins />} value={loading ? '…' : String(economy?.coins ?? '—')} label="monedas" tone="bg-amber-100 text-amber-700" />
                        <Balance icon={<Gem />} value={loading ? '…' : String(economy?.gems ?? '—')} label="gemas" tone="bg-cyan-100 text-cyan-700" />
                        <Balance icon={<Heart />} value={loading ? '…' : economy ? `${economy.lives}/${economy.max_lives}` : '—'} label="vidas" tone="bg-rose-100 text-rose-700" />
                    </div>
                    <p className="mt-2 text-center text-[9px] font-semibold text-fuchsia-900/70">Practicar vocabulario no consume recursos al comenzar.</p>
                </section>

                <Button onClick={onPlay} className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-600 font-black text-white shadow-lg hover:from-violet-600 hover:to-fuchsia-500">Practicar vocabulario <Play className="ml-2 h-4 w-4 fill-current" /></Button>
                <p className="text-center text-[9px] text-slate-500">Aprende, practica y descubre cómo se habla en Cali.</p>
            </aside>
        </div>
    </ModeLobbyShell>;
};

const Metric = ({ value, label }: { value: string; label: string }) => <div className="rounded-xl bg-violet-50 px-2 py-2.5 text-center"><strong className="block truncate text-base font-black text-[#42136f]">{value}</strong><span className="text-[7px] font-black uppercase tracking-wide text-slate-500">{label}</span></div>;
const PracticeBenefit = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => <div className="flex gap-2 rounded-xl bg-violet-50/80 px-2.5 py-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-fuchsia-600 shadow-sm [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div><strong className="block text-[10px] text-violet-950">{title}</strong><p className="mt-0.5 text-[8px] leading-relaxed text-slate-600">{body}</p></div></div>;
const Balance = ({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: string }) => <div className="rounded-xl bg-white p-2 text-center shadow-sm"><span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4 ${tone}`}>{icon}</span><strong className="mt-1 block truncate text-xs font-black text-violet-950">{value}</strong><span className="block text-[7px] font-black uppercase text-fuchsia-700/70">{label}</span></div>;
