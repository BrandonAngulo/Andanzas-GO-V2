import React, { useEffect, useState } from 'react';
import {
    Clock3,
    Copy,
    Gauge,
    Heart,
    Loader2,
    Medal,
    Play,
    Share2,
    ShieldCheck,
    Sparkles,
    Swords,
    Target,
    Timer,
    Trophy,
    UserRound,
    UsersRound,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Game } from '../../../services/games.service';
import { challengeService, type DuelSummary } from '../../../services/challenge.service';
import { Button } from '../../ui/button';
import { InfoTooltip } from '../../ui/tooltip';
import { ModeLobbyShell } from './ModeLobbyShell';

interface Props {
    game: Game;
    onClose: () => void;
    onStart: () => void;
}

export const DuelModeHub: React.FC<Props> = ({ game, onClose, onStart }) => {
    const [summary, setSummary] = useState<DuelSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        void challengeService.getMyDuelSummary(game.id)
            .then(value => { if (alive) setSummary(value); })
            .catch(() => { if (alive) setSummary(null); })
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, [game.id]);

    const copyPendingLink = async () => {
        if (!summary?.latestAwaitingId) return;
        const link = `${window.location.origin}/#/challenge/${summary.latestAwaitingId}`;
        try {
            await navigator.clipboard.writeText(link);
            toast.success('Enlace del duelo copiado');
        } catch {
            toast.error('No se pudo copiar el enlace');
        }
    };

    return <ModeLobbyShell
        eyebrow="TRIVIA GO · Antesala de modo"
        title="Duelo"
        subtitle="Conoce las reglas, revisa tu marcador y crea el reto cuando estés listo."
        onClose={onClose}
    >
        <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#31105e] via-[#6d28d9] to-[#db2777] p-5 text-white shadow-xl sm:p-7">
            <Swords className="absolute -right-10 -top-12 h-72 w-72 rotate-12 text-white/[0.07]" />
            <div className="relative z-10 grid items-center gap-5 md:grid-cols-[1fr_20rem]">
                <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-violet-950"><Sparkles className="h-3 w-3" /> Mismo reto para ambos</span>
                    <h2 className="mt-3 text-3xl font-black sm:text-5xl">Juega primero.<br />Reta después.</h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">Responde un conjunto único de diez preguntas y comparte el enlace. Tu rival recibirá exactamente el mismo recorrido.</p>
                </div>
                <div className="relative mx-auto h-44 w-72 sm:h-52 sm:w-80">
                    <div className="absolute left-0 top-2 flex h-32 w-32 items-center justify-center rounded-full border-8 border-white/15 bg-white/10 shadow-2xl backdrop-blur sm:h-40 sm:w-40"><UserRound className="h-14 w-14 text-violet-100 sm:h-16 sm:w-16" /><span className="absolute bottom-4 rounded-full bg-violet-950/70 px-3 py-1 text-[8px] font-black uppercase tracking-wider">Tú</span></div>
                    <div className="absolute right-0 top-2 flex h-32 w-32 items-center justify-center rounded-full border-8 border-white/15 bg-white/10 shadow-2xl backdrop-blur sm:h-40 sm:w-40"><UserRound className="h-14 w-14 text-rose-100 sm:h-16 sm:w-16" /><span className="absolute bottom-4 rounded-full bg-rose-950/70 px-3 py-1 text-[8px] font-black uppercase tracking-wider">Tu rival</span></div>
                    <span className="absolute left-1/2 top-[4.2rem] z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-amber-300 text-violet-950 shadow-lg ring-4 ring-violet-800"><Swords className="h-5 w-5" /></span>
                </div>
            </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
            <section className="rounded-2xl border border-violet-900/10 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-700">Así funciona</p>
                <h3 className="mt-1 text-xl font-black">Un duelo justo, en cuatro pasos</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Step number="1" icon={<Play />} title="Juega tu ronda" body="Responde 10 preguntas antes de que termine el reloj." />
                    <Step number="2" icon={<Share2 />} title="Comparte el enlace" body="El reto queda disponible durante 7 días para un rival." />
                    <Step number="3" icon={<UsersRound />} title="Mismas preguntas" body="Tu rival recibe el mismo conjunto, sin ver tus respuestas." />
                    <Step number="4" icon={<Trophy />} title="Descubre el resultado" body="Primero cuentan los aciertos; después el puntaje y el tiempo." />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <Rule icon={<Target />} value="10" label="preguntas" />
                    <Rule icon={<Clock3 />} value="3 min" label="tiempo total" />
                    <Rule icon={<Timer />} value="25 s" label="por pregunta" />
                </div>
            </section>

            <aside className="space-y-3">
                <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-rose-50 p-4">
                    <div className="flex items-center justify-between gap-2"><div><p className="text-[9px] font-black uppercase tracking-wide text-violet-700">Tu historial en Duelo</p><h3 className="text-sm font-black text-violet-950">Resultados reales</h3></div>{loading ? <Loader2 className="h-5 w-5 animate-spin text-violet-600" /> : <Medal className="h-5 w-5 text-violet-600" />}</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <Stat value={loading ? '…' : String(summary?.played ?? 0)} label="Finalizados" icon={<Swords />} />
                        <Stat value={loading ? '…' : String(summary?.wins ?? 0)} label="Ganados" icon={<Trophy />} />
                        <Stat value={loading ? '…' : String(summary?.awaitingOpponent ?? 0)} label="En espera" icon={<Gauge />} />
                    </div>
                    {!loading && summary && <p className="mt-2 text-center text-[9px] text-violet-900/65">Mejor puntaje: <strong>{summary.bestScore}</strong>{summary.draws > 0 ? ` · Empates: ${summary.draws}` : ''}</p>}
                    {summary?.latestAwaitingId && <button type="button" onClick={copyPendingLink} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-[10px] font-black text-violet-700 transition hover:border-violet-400 hover:bg-violet-50"><Copy className="h-3.5 w-3.5" /> Copiar último duelo pendiente</button>}
                </section>

                <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex gap-3"><span className="rounded-xl bg-emerald-500 p-2 text-white"><ShieldCheck className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700">Tu inventario está a salvo</p><InfoTooltip title="Recursos en Duelo" body="La lógica actual de Duelo no compra intentos ni descuenta monedas, gemas o vidas. El resultado se guarda como marcador competitivo."><button type="button" aria-label="Explicación sobre recursos en Duelo" className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-700/15 bg-white text-emerald-700"><Heart className="h-3.5 w-3.5" /></button></InfoTooltip></div><h3 className="font-black text-emerald-950">Jugar no consume recursos</h3><p className="mt-1 text-[11px] leading-relaxed text-emerald-900/70">No se descuentan monedas, gemas ni vidas. Aquí compiten tus aciertos, tu puntaje y tu tiempo.</p></div></div>
                </section>

                <Button onClick={onStart} className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-black text-white shadow-lg hover:from-violet-500 hover:to-fuchsia-500">Crear mi duelo <Swords className="ml-2 h-4 w-4" /></Button>
                <p className="text-center text-[9px] text-slate-500">Al entrar se crea el reto y comienza tu ronda.</p>
            </aside>
        </div>
    </ModeLobbyShell>;
};

const Step = ({ number, icon, title, body }: { number: string; icon: React.ReactNode; title: string; body: string }) => <div className="relative rounded-xl bg-violet-50 p-3 pl-12"><span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-[10px] font-black text-white">{number}</span><div className="flex items-center gap-1.5 text-violet-800 [&>svg]:h-4 [&>svg]:w-4">{icon}<strong className="text-xs">{title}</strong></div><p className="mt-1 text-[10px] leading-relaxed text-slate-600">{body}</p></div>;

const Rule = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => <div className="rounded-xl border border-violet-100 bg-white p-2.5 text-center text-violet-900"><span className="mx-auto flex h-6 w-6 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span><strong className="mt-1 block text-sm font-black leading-none">{value}</strong><span className="mt-1 block text-[7px] font-black uppercase tracking-wide text-violet-700/65">{label}</span></div>;

const Stat = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => <div className="rounded-xl border border-violet-100 bg-white px-1.5 py-2.5 text-center shadow-sm"><span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span><strong className="mt-1.5 block text-sm font-black text-violet-950">{value}</strong><span className="block text-[7px] font-black uppercase tracking-wide text-violet-700/65">{label}</span></div>;
