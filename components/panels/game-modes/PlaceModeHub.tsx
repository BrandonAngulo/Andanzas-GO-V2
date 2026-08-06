import React, { useEffect, useMemo, useState } from 'react';
import {
    ChevronRight,
    Compass,
    Globe2,
    HelpCircle,
    MapPinned,
    Play,
    ShieldCheck,
} from 'lucide-react';
import { gamesService, type Game, type GameModeSessionSummary, type GameTheme } from '../../../services/games.service';
import { Button } from '../../ui/button';
import { InfoTooltip } from '../../ui/tooltip';
import { ModeLobbyShell } from './ModeLobbyShell';

interface Props {
    game: Game;
    themes: GameTheme[];
    onClose: () => void;
    onPlay: (theme: GameTheme) => void;
}

type PlaceIdentity = {
    scope: string;
    description: string;
    accent: string;
    mark: 'world' | 'colombia' | 'cane' | 'salsa' | 'place';
    markLabel: string;
};

const placeOrder = ['world_general', 'country_colombia', 'region_valle_del_cauca', 'city_cali'];
const placeCopy: Record<string, PlaceIdentity> = {
    world_general: {
        scope: 'Mundo',
        description: 'Culturas, lugares, ciencia e historias para viajar sin salir de la partida.',
        accent: 'from-sky-500 to-blue-700',
        mark: 'world',
        markLabel: 'Planeta Tierra',
    },
    country_colombia: {
        scope: 'País',
        description: 'Regiones, símbolos, personajes y diversidad cultural de Colombia.',
        accent: 'from-amber-400 to-orange-500',
        mark: 'colombia',
        markLabel: 'Bandera de Colombia',
    },
    region_valle_del_cauca: {
        scope: 'Región',
        description: 'Paisajes, municipios, tradiciones y memoria del Valle del Cauca.',
        accent: 'from-lime-500 to-emerald-600',
        mark: 'cane',
        markLabel: 'Caña de azúcar del Valle del Cauca',
    },
    city_cali: {
        scope: 'Ciudad',
        description: 'Barrios, sabores, música, naturaleza e historias de Cali.',
        accent: 'from-emerald-500 to-teal-700',
        mark: 'salsa',
        markLabel: 'Salsa caleña',
    },
};

const fallbackIdentity = (label: string): PlaceIdentity => ({
    scope: 'Territorio',
    description: `Descubre preguntas e historias de ${label}.`,
    accent: 'from-emerald-500 to-teal-700',
    mark: 'place',
    markLabel: `Ubicación de ${label}`,
});

export const PlaceModeHub: React.FC<Props> = ({ game, themes, onClose, onPlay }) => {
    const places = useMemo(() => themes.filter(theme => theme.kind === 'place' && placeOrder.includes(theme.key)).sort((a, b) => {
        const ai = placeOrder.indexOf(a.key);
        const bi = placeOrder.indexOf(b.key);
        return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    }), [themes]);
    const [selectedKey, setSelectedKey] = useState(() => places.find(theme => theme.key === 'city_cali')?.key || places[0]?.key || '');
    const selected = places.find(theme => theme.key === selectedKey) || places[0];
    const detail = selected ? (placeCopy[selected.key] || fallbackIdentity(selected.label)) : null;
    const [summary, setSummary] = useState<GameModeSessionSummary | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    useEffect(() => {
        if (!selected?.key) { setSummary(null); return; }
        let alive = true;
        setLoadingSummary(true);
        void gamesService.getMyGameModeSummary(game.id, 'lugar', selected.key)
            .then(value => { if (alive) setSummary(value); })
            .catch(() => { if (alive) setSummary(null); })
            .finally(() => { if (alive) setLoadingSummary(false); });
        return () => { alive = false; };
    }, [game.id, selected?.key]);

    return <ModeLobbyShell eyebrow="TRIVIA GO · Antesala de modo" title="Jugar por lugar" subtitle="Elige una escala y comienza tu recorrido territorial." onClose={onClose}>
        <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#06434a] via-[#08705d] to-[#10a36f] px-4 py-4 text-white shadow-xl sm:px-5 sm:py-4">
            <Globe2 className="absolute -right-7 -top-10 h-44 w-44 text-white/[0.07]" />
            <div className="relative z-10 grid items-center gap-2 sm:grid-cols-[1fr_10rem]">
                <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-amber-950"><Compass className="h-3 w-3" /> Exploración territorial</span>
                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">¿Hasta dónde quieres llegar?</h2>
                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/75 sm:text-sm">Ciudad, región, país o mundo: cada escala organiza una colección distinta de preguntas.</p>
                </div>
                <img src="/images/games/trivia-go/andi-adventure-guide-v1.png" alt="Andi sostiene el mapa de territorios" className="mx-auto hidden h-28 w-28 object-contain drop-shadow-2xl sm:block sm:h-32 sm:w-32" />
            </div>
        </section>

        {places.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-white p-5 text-center shadow"><MapPinned className="mx-auto h-8 w-8 text-emerald-600" /><h3 className="mt-2 font-black">No hay territorios publicados</h3><p className="mt-1 text-sm text-slate-500">El equipo editorial está preparando los primeros recorridos.</p></div>
        ) : (
            <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
                <section className="rounded-2xl border border-emerald-900/10 bg-white/90 p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-2"><div><p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700">Escalas disponibles</p><h3 className="text-sm font-black">Elige tu territorio</h3></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700">{places.length} recorridos</span></div>
                    <div className="grid gap-2 sm:grid-cols-2">{places.map((theme, index) => {
                        const item = placeCopy[theme.key] || fallbackIdentity(theme.label);
                        const active = theme.key === selected?.key;
                        return <button
                            key={theme.key}
                            type="button"
                            onClick={() => setSelectedKey(theme.key)}
                            aria-pressed={active}
                            className={`group relative flex min-h-[5.4rem] items-center gap-3 overflow-hidden rounded-xl border-2 px-3 py-2 text-left transition-all ${active ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-emerald-300 hover:bg-white'}`}
                        >
                            <PlaceMark identity={item} compact />
                            <span className="min-w-0 flex-1"><span className="block text-[7px] font-black uppercase tracking-[0.14em] text-slate-500">{item.scope} · Escala {index + 1}</span><strong className="block truncate text-sm font-black text-[#073c43]">{theme.label}</strong><span className="block text-[9px] text-slate-500">{theme.questionCount || 0} preguntas</span></span>
                            {active ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" /> : null}
                        </button>;
                    })}</div>
                </section>

                {selected && detail ? <aside className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-lg">
                    <div className={`flex items-center gap-3 bg-gradient-to-br ${detail.accent} p-3 text-white`}>
                        <PlaceMark identity={detail} />
                        <div className="min-w-0"><p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/70">Recorrido seleccionado</p><h3 className="truncate text-xl font-black">{selected.label}</h3><p className="mt-0.5 text-[10px] leading-relaxed text-white/80">{detail.description}</p></div>
                    </div>
                    <div className="space-y-2.5 p-3">
                        <div className="grid grid-cols-2 gap-2"><MiniStat value="15" label="por ronda" /><MiniStat value={`${selected.questionCount || 0}`} label="disponibles" /><MiniStat value={loadingSummary ? '…' : String(summary?.completed || 0)} label="completadas" /><MiniStat value={loadingSummary ? '…' : (summary?.best_score || 0).toLocaleString('es-CO')} label="mejor puntaje" /></div>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /><p className="flex-1 text-[10px] leading-relaxed text-emerald-900/75"><strong>Entrada sin costo:</strong> este recorrido no descuenta monedas, gemas ni vidas.</p><InfoTooltip title="Recursos en Jugar por lugar" body="La modalidad actual comparte las recompensas generales de TRIVIA GO y no consume objetos al iniciar. No se mostrarán pistas o ayudas hasta que exista una lógica real para ellas."><button type="button" aria-label="Explicación de recursos" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm"><HelpCircle className="h-4 w-4" /></button></InfoTooltip></div>
                        <details className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"><summary className="flex cursor-pointer list-none items-center gap-2 font-bold"><HelpCircle className="h-4 w-4 text-emerald-600" /> Cómo se juega <ChevronRight className="ml-auto h-4 w-4" /></summary><p className="mt-2 text-[10px] leading-relaxed text-slate-500">Responde 15 preguntas relacionadas con el territorio. Cada acierto aporta al resultado general de TRIVIA GO.</p></details>
                        <Button onClick={() => onPlay(selected)} className="h-10 w-full rounded-xl bg-[#08705d] text-sm font-black shadow-lg hover:bg-[#075b50]">Jugar en {selected.label} <Play className="ml-2 h-4 w-4 fill-current" /></Button>
                    </div>
                </aside> : null}
            </div>
        )}
    </ModeLobbyShell>;
};

const PlaceMark = ({ identity, compact = false }: { identity: PlaceIdentity; compact?: boolean }) => {
    const iconClass = compact ? 'h-5 w-5' : 'h-6 w-6';
    const tone = identity.mark === 'world'
        ? 'bg-gradient-to-br from-sky-400 to-blue-700 text-white'
        : identity.mark === 'cane'
            ? 'bg-gradient-to-br from-lime-300 to-emerald-700 text-white'
            : identity.mark === 'salsa'
                ? 'bg-gradient-to-br from-orange-400 via-rose-500 to-violet-700 text-white'
                : identity.mark === 'place'
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-700 text-white'
                    : 'bg-white text-slate-900';
    return <span role="img" aria-label={identity.markLabel} className={`${compact ? 'h-11 w-11' : 'h-14 w-14'} ${tone} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-lg ring-2 ring-slate-900/10`}>
        {identity.mark === 'colombia' ? <ColombiaFlag /> : identity.mark === 'world' ? <Globe2 className={iconClass} /> : identity.mark === 'cane' ? <SugarCaneMark className={iconClass} /> : identity.mark === 'salsa' ? <SalsaMark className={iconClass} /> : <MapPinned className={iconClass} />}
    </span>;
};

const ColombiaFlag = () => <span className="flex h-full w-full flex-col" aria-hidden="true"><span className="h-1/2 bg-[#FCD116]" /><span className="h-1/4 bg-[#003893]" /><span className="h-1/4 bg-[#CE1126]" /></span>;

const SugarCaneMark = ({ className }: { className?: string }) => <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 27 18 5M18 27 23 9" strokeWidth="3" />
    <path d="m14 20 5 1M15.5 14l5 1M17 8l4 1M19.5 20l5 1M21 14l4 1" strokeWidth="1.6" opacity=".9" />
    <path d="M18 8c-5-1-8-4-9-7 5 0 8 2 9 7ZM22 12c4-1 7-4 8-7-5 0-7 2-8 7ZM15 16c-4 0-7-2-9-5 5-1 8 1 9 5Z" fill="currentColor" strokeWidth="1" />
</svg>;

const SalsaMark = ({ className }: { className?: string }) => <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 26 8-12M23 26 15 14" strokeWidth="2.6" />
    <path d="M13 7c2.5 3 2.5 6 .2 8.2-2.2 2.2-5.2 2-7.2-.2-2-2.1-1.8-5.4.4-7.5C8.5 5.4 11 5.2 13 7Z" fill="currentColor" strokeWidth="1.2" />
    <path d="M19 7c-2.5 3-2.5 6-.2 8.2 2.2 2.2 5.2 2 7.2-.2 2-2.1 1.8-5.4-.4-7.5C23.5 5.4 21 5.2 19 7Z" fill="currentColor" strokeWidth="1.2" />
    <path d="M8 9.5h4M20 9.5h4" stroke="#FDE68A" strokeWidth="1.5" />
</svg>;

const MiniStat = ({ value, label }: { value: string; label: string }) => <span className="flex items-baseline justify-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1.5"><strong className="truncate text-sm font-black text-emerald-800">{value}</strong><span className="truncate text-[7px] font-black uppercase tracking-wide text-emerald-700/70">{label}</span></span>;
