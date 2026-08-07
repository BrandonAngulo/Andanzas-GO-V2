import React, { useEffect, useState } from 'react';
import {
    CheckCircle2,
    Clock3,
    Coins,
    Gauge,
    Gem,
    Heart,
    HelpCircle,
    Loader2,
    Play,
    ShieldAlert,
    Sparkles,
    Timer,
    Zap,
} from 'lucide-react';
import { gamificationService, type EconomySummary } from '../../../services/gamification.service';
import { gamesService, type Game, type GameModeSessionSummary } from '../../../services/games.service';
import type { GameModifier } from '../../../services/modifier.service';
import { Button } from '../../ui/button';
import { InfoTooltip } from '../../ui/tooltip';
import { ModeLobbyShell } from './ModeLobbyShell';

interface Props {
    game: Game;
    modifier: GameModifier | null;
    onClose: () => void;
    onPlay: () => void;
}

const explainModifier = (modifier: GameModifier) => {
    const effects: string[] = [];
    if (modifier.config.time_scale && modifier.config.time_scale !== 1) {
        const percent = Math.round(Math.abs(1 - modifier.config.time_scale) * 100);
        effects.push(modifier.config.time_scale < 1 ? `Tendrás ${percent}% menos tiempo.` : `Tendrás ${percent}% más tiempo.`);
    }
    if (modifier.config.score_multiplier && modifier.config.score_multiplier !== 1) {
        effects.push(`Tus puntos se multiplican por ${modifier.config.score_multiplier}.`);
    }
    if (modifier.config.force_mechanic === 'sudden_death') effects.push('La primera respuesta incorrecta termina la ronda.');
    if (modifier.config.force_mechanic === 'lives') effects.push('Jugarás con vidas: cada error consume una.');
    if (modifier.config.force_mechanic === 'multiplier') effects.push('Las respuestas seguidas aumentan tu multiplicador.');
    if (modifier.config.force_mechanic === 'safe_zones') effects.push('Habrá puntos del recorrido donde tu avance queda protegido.');
    return effects.join(' ') || modifier.description;
};

export const TimedModeHub: React.FC<Props> = ({ game, modifier, onClose, onPlay }) => {
    const [economy, setEconomy] = useState<EconomySummary | null>(null);
    const [summary, setSummary] = useState<GameModeSessionSummary | null>(null);
    const [loadingEconomy, setLoadingEconomy] = useState(true);

    useEffect(() => {
        let alive = true;
        void Promise.allSettled([
            gamificationService.getEconomySummary(),
            gamesService.getMyGameModeSummary(game.id, 'contrarreloj'),
        ]).then(([economyResult, summaryResult]) => {
            if (!alive) return;
            if (economyResult.status === 'fulfilled') setEconomy(economyResult.value);
            if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value);
        }).finally(() => {
            if (alive) setLoadingEconomy(false);
        });
        return () => { alive = false; };
    }, [game.id]);

    return <ModeLobbyShell
        eyebrow="TRIVIA GO · Antesala de modo"
        title="Contrarreloj"
        subtitle="Conoce el ritmo y las reglas antes de que empiece el tiempo."
        onClose={onClose}
    >
        <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#063b5b] via-[#0879a5] to-[#19b8c8] p-5 text-white shadow-xl sm:p-7">
            <Timer className="absolute -right-10 -top-12 h-64 w-64 text-white/[0.07]" />
            <div className="relative z-10 grid items-center gap-5 sm:grid-cols-[1fr_17rem]">
                <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-200 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-sky-950"><Zap className="h-3 w-3 fill-current" /> Velocidad y precisión</span>
                    <h2 className="mt-3 text-3xl font-black sm:text-5xl">Dos minutos.<br />Un solo intento.</h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">Responde rápido, sostén la racha y evita el primer error. El reloj no se detiene entre preguntas.</p>
                </div>
                <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border-[10px] border-white/15 bg-black/15 shadow-2xl backdrop-blur sm:h-56 sm:w-56">
                    <div className="absolute inset-3 rounded-full border border-cyan-200/30" />
                    <Clock3 className="absolute top-7 h-6 w-6 text-cyan-200" />
                    <strong className="text-5xl font-black tracking-tight">2:00</strong>
                    <span className="absolute bottom-8 text-[8px] font-black uppercase tracking-[0.2em] text-white/60">Tiempo total</span>
                </div>
            </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <section className="rounded-2xl border border-sky-900/10 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-sky-700">Reglas de la ronda</p>
                <h3 className="mt-1 text-xl font-black">Lo que debes saber</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Rule icon={<Timer />} value="2 min" label="tiempo total" />
                    <Rule icon={<Gauge />} value="15" label="preguntas máximo" />
                    <Rule icon={<ShieldAlert />} value="1 error" label="finaliza la ronda" />
                </div>
                <div className="mt-4 rounded-xl bg-sky-50 p-3">
                    <div className="flex gap-2"><Sparkles className="h-4 w-4 shrink-0 text-sky-600" /><div><p className="text-[9px] font-black uppercase tracking-wide text-sky-700">Consejo de Andi</p><p className="mt-0.5 text-xs leading-relaxed text-slate-600">Lee primero la pregunta y después busca la opción. La velocidad ayuda, pero acertar te mantiene en carrera.</p></div></div>
                </div>
            </section>

            <aside className="space-y-3">
                {modifier ? (
                    <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
                        <div className="flex gap-3">
                            <span className="rounded-xl bg-amber-400 p-2 text-amber-950"><Zap className="h-5 w-5" /></span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2"><p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-700">Regla especial de esta semana</p><InfoButton title="¿Qué es una regla especial?" body="Es un cambio temporal que renueva la forma de jugar. Se aplica automáticamente y no consume objetos de tu inventario." /></div>
                                <h3 className="font-black">{modifier.label}</h3>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{modifier.description}</p>
                                <p className="mt-2 rounded-lg bg-white/70 px-2.5 py-2 text-[10px] font-semibold leading-relaxed text-orange-900"><span className="font-black">En esta ronda:</span> {explainModifier(modifier)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex gap-3"><span className="rounded-xl bg-emerald-500 p-2 text-white"><CheckCircle2 className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700">Esta semana</p><InfoButton title="Reglas normales" body="En algunas semanas aparecerá aquí una regla temporal con un efecto distinto. Hoy puedes jugar Contrarreloj tal como lo conoces." /></div><h3 className="font-black text-emerald-950">Juegas con las reglas normales</h3><p className="mt-1 text-[11px] text-emerald-900/70">Dos minutos, hasta 15 preguntas y la ronda termina al primer error.</p></div></div>
                    </div>
                )}

                <section className="rounded-2xl border border-sky-200 bg-white p-3 shadow-sm">
                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-sky-700">Tu historial Contrarreloj</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        <HistoryMetric value={loadingEconomy ? '…' : String(summary?.completed || 0)} label="completadas" />
                        <HistoryMetric value={loadingEconomy ? '…' : (summary?.best_score || 0).toLocaleString('es-CO')} label="mejor puntaje" />
                        <HistoryMetric value={loadingEconomy ? '…' : `${summary?.best_accuracy || 0}%`} label="mejor precisión" />
                    </div>
                    {!loadingEconomy && !summary?.completed ? <p className="mt-2 text-center text-[9px] text-slate-500">El historial específico comienza con tu próxima ronda.</p> : null}
                </section>

                <section className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <div className="flex items-center justify-between gap-2"><div><p className="text-[9px] font-black uppercase tracking-wide text-sky-800">Tus recursos de TRIVIA GO</p><h3 className="text-sm font-black text-sky-950">Lo que tienes y para qué sirve</h3></div>{loadingEconomy ? <Loader2 className="h-5 w-5 animate-spin text-sky-600" /> : <Sparkles className="h-5 w-5 text-sky-600" />}</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <ResourceChip icon={<Coins />} value={loadingEconomy ? '…' : economy ? String(economy.coins) : '—'} label="Monedas" title="Monedas" body="Las ganas al terminar partidas según tu puntaje. Puedes usarlas para recuperar vidas en los modos que las necesitan." color="amber" />
                        <ResourceChip icon={<Gem />} value={loadingEconomy ? '…' : economy ? String(economy.gems) : '—'} label="Gemas" title="Gemas" body="Pueden aparecer como premio al finalizar; una buena precisión aumenta la posibilidad. Sirven para recuperar vidas y beneficios especiales." color="cyan" />
                        <ResourceChip icon={<Heart />} value={loadingEconomy ? '…' : economy ? `${economy.lives}/${economy.max_lives}` : '—'} label="Vidas" title="Vidas" body={`Se usan en modos con riesgo y se recuperan automáticamente${economy ? ` cada ${Math.round(economy.life_recharge_minutes / 60)} horas` : ''}. Contrarreloj no descuenta vidas al comenzar.`} color="rose" />
                    </div>
                    <p className="mt-2 text-center text-[9px] font-semibold text-sky-800/75">Jugar Contrarreloj no descuenta monedas, gemas ni vidas. Toca cada recurso para conocerlo.</p>
                    {!loadingEconomy && !economy && <p className="mt-1 text-center text-[9px] text-slate-500">Inicia sesión para consultar tus saldos y recibir las recompensas de la partida.</p>}
                </section>

                <Button onClick={onPlay} className="h-12 w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 font-black text-white shadow-lg hover:from-sky-400 hover:to-cyan-400">Iniciar Contrarreloj <Play className="ml-2 h-4 w-4 fill-current" /></Button>
                <p className="text-center text-[9px] text-slate-500">{game.title} · preguntas variadas para esta ronda</p>
            </aside>
        </div>
    </ModeLobbyShell>;
};

const Rule = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
    <div className="rounded-xl bg-sky-50 p-3 text-center text-sky-900"><span className="mx-auto flex h-7 w-7 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">{icon}</span><strong className="mt-1 block text-lg font-black leading-none">{value}</strong><span className="mt-1 block text-[8px] uppercase tracking-wide text-sky-700/70">{label}</span></div>
);

const HistoryMetric = ({ value, label }: { value: string; label: string }) => <div className="rounded-xl bg-sky-50 px-2 py-2 text-center"><strong className="block truncate text-sm font-black text-sky-950">{value}</strong><span className="block truncate text-[7px] font-black uppercase tracking-wide text-sky-700/70">{label}</span></div>;

const InfoButton = ({ title, body }: { title: string; body: string }) => (
    <InfoTooltip title={title} body={body}>
        <button type="button" aria-label={title} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/15 bg-white/70 text-current transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-current/30"><HelpCircle className="h-4 w-4" /></button>
    </InfoTooltip>
);

const RESOURCE_COLORS = {
    amber: 'border-amber-200 hover:border-amber-400 focus:ring-amber-400 [&_.resource-icon]:bg-amber-100 [&_.resource-icon]:text-amber-600 group-hover:[&_.resource-icon]:bg-amber-500',
    cyan: 'border-cyan-200 hover:border-cyan-400 focus:ring-cyan-400 [&_.resource-icon]:bg-cyan-100 [&_.resource-icon]:text-cyan-600 group-hover:[&_.resource-icon]:bg-cyan-500',
    rose: 'border-rose-200 hover:border-rose-400 focus:ring-rose-400 [&_.resource-icon]:bg-rose-100 [&_.resource-icon]:text-rose-600 group-hover:[&_.resource-icon]:bg-rose-500',
} as const;

const ResourceChip = ({ icon, value, label, title, body, color }: { icon: React.ReactNode; value: string; label: string; title: string; body: string; color: keyof typeof RESOURCE_COLORS }) => (
    <InfoTooltip title={title} body={body}>
        <button type="button" aria-label={`${title}: ${body}`} className={`group min-w-0 rounded-xl border bg-white px-1.5 py-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 ${RESOURCE_COLORS[color]}`}>
            <span className="resource-icon mx-auto flex h-8 w-8 items-center justify-center rounded-full transition group-hover:text-white [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
            <strong className="mt-1.5 block truncate text-[11px] font-black text-sky-950">{value}</strong>
            <span className="block truncate text-[7px] font-black uppercase tracking-wide text-sky-700/70">{label}</span>
        </button>
    </InfoTooltip>
);
