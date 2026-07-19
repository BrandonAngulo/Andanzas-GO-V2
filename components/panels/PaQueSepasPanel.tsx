import React, { useState } from 'react';
import { LearnEntry } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { BookOpen, MapPin, ChevronRight, Hash, Sparkles, Footprints, Lightbulb, Library, Headphones, RefreshCw, CalendarDays } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { TextWithLearnLinks } from '../shared/TextWithLearnLinks';
import { Game, gamesService } from '../../services/games.service';
import { Gamepad2, Quote } from 'lucide-react';
import { PanelBanner } from './shared/PanelBanner';
import { DailyQuestion } from '../views/DailyQuestion';

interface PaQueSepasPanelProps {
    entries: LearnEntry[];
    onOpenSite?: (siteId: string) => void;
    isLoading?: boolean;
    initialEntryId?: string | null;
    onInitialConsumed?: () => void;
    dictionaryVisible?: boolean;
    onOpenDictionary?: () => void;
}

const PaQueSepasPanel: React.FC<PaQueSepasPanelProps> = ({ entries, onOpenSite, isLoading, initialEntryId, onInitialConsumed, dictionaryVisible, onOpenDictionary }) => {
    const { t, language } = useI18n();
    const [selectedEntry, setSelectedEntry] = useState<LearnEntry | null>(null);
    const [showDaily, setShowDaily] = useState(false);
    const [relatedGames, setRelatedGames] = useState<Game[]>([]);
    const [factIndex, setFactIndex] = useState(0);
    const storiesRef = React.useRef<HTMLDivElement>(null);

    // Se muestra UN solo dato curioso por historia. El punto de partida rota por
    // día (mismo día = mismo dato), y el usuario puede recorrer el banco de esa
    // historia con "Otro dato". Así aprovechamos mejor la cantidad de datos.
    React.useEffect(() => {
        const total = selectedEntry?.sabias_que?.length ?? 0;
        if (total > 0) {
            const daySeed = Math.floor(Date.now() / 86400000);
            setFactIndex(daySeed % total);
        } else {
            setFactIndex(0);
        }
    }, [selectedEntry]);

    // Al entrar con una entrada objetivo (p. ej. desde un dato curioso), la abre directamente.
    // Si no existe entre las entradas cargadas, se queda en la vista general (fallback).
    React.useEffect(() => {
        if (!initialEntryId) return;
        const found = entries.find(e => e.id === initialEntryId);
        if (found) setSelectedEntry(found);
        onInitialConsumed?.();
    }, [initialEntryId, entries]);

    React.useEffect(() => {
        if (selectedEntry) {
            gamesService.getAllGames().then(allGames => {
                const published = allGames.filter(g => g.status === 'published');
                const related = published.filter(g => g.related_learn_ids?.includes(selectedEntry.id));
                setRelatedGames(related);
            });
        } else {
            setRelatedGames([]);
        }
    }, [selectedEntry]);

    if (selectedEntry) {
        return (
            <ScrollArea className="h-[72vh] bg-background">
                <div className="p-4 md:p-6 max-w-3xl mx-auto">
                    <Button variant="ghost" onClick={() => setSelectedEntry(null)} className="mb-4 -ml-2 text-muted-foreground">
                        ← Volver a Saberes
                    </Button>
                    
                    {selectedEntry.image_url && (
                        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 bg-muted">
                            <img src={selectedEntry.image_url} alt={getTranslated(selectedEntry, 'title', language)} className="w-full h-full object-cover" />
                        </div>
                    )}
                    
                    <div className="mb-6 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            <MapPin className="w-3 h-3 mr-1" /> {selectedEntry.city}
                        </Badge>
                        {selectedEntry.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-muted-foreground">
                                <Hash className="w-3 h-3 mr-1" /> {tag}
                            </Badge>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-foreground">{getTranslated(selectedEntry, 'title', language)}</h2>
                    
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-4">
                        {(getTranslated(selectedEntry, 'content_full', language) as string || getTranslated(selectedEntry, 'content_simple', language) as string || '').split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-foreground/90 leading-relaxed text-[16px] whitespace-pre-wrap">
                                <TextWithLearnLinks 
                                    text={paragraph} 
                                    entries={entries} 
                                    onNavigate={(entry) => setSelectedEntry(entry)} 
                                    currentEntryId={selectedEntry.id} 
                                />
                            </p>
                        ))}
                    </div>

                    {selectedEntry.sabias_que && selectedEntry.sabias_que.length > 0 && (() => {
                        const facts = selectedEntry.sabias_que!;
                        const total = facts.length;
                        const current = factIndex % total;
                        return (
                            <div className="mt-8 p-6 relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-border shadow-lg">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                                <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
                                    <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                                        <Sparkles className="w-5 h-5" />
                                        ¿Sabías que?
                                    </h3>
                                    {total > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setFactIndex(i => (i + 1) % total)}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" /> Otro dato
                                        </button>
                                    )}
                                </div>
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <p key={current} className="text-[15px] text-foreground/85 leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-300">
                                        {facts[current]}
                                    </p>
                                </div>
                                {total > 1 && (
                                    <div className="relative z-10 mt-4 flex items-center gap-1.5">
                                        {facts.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                aria-label={`Dato ${idx + 1} de ${total}`}
                                                onClick={() => setFactIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all ${idx === current ? 'w-5 bg-primary' : 'w-1.5 bg-primary/25 hover:bg-primary/50'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {relatedGames.length > 0 && (
                        <div className="mt-8 p-6 relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/20">
                            <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-primary">
                                <Gamepad2 className="w-5 h-5" />
                                Ponete a prueba
                            </h3>
                            <div className="space-y-3">
                                {relatedGames.map(g => (
                                    <Button 
                                        key={g.id} 
                                        variant="outline" 
                                        className="w-full justify-start py-6 text-left"
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-game', { detail: { gameId: g.id } }))}
                                    >
                                        <div>
                                            <div className="font-bold">{g.title}</div>
                                            <div className="text-xs text-muted-foreground">{g.description}</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 ml-auto opacity-50" />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(selectedEntry.site_ids?.length) && onOpenSite && (
                        <div className="mt-10 p-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center shadow-sm">
                            <h4 className="font-bold text-xl mb-3 text-foreground">Vívelo tú mismo</h4>
                            <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                                {selectedEntry.cta || "Esta historia cobra vida en uno de nuestros sitios recomendados."}
                            </p>
                            <Button 
                                onClick={() => {
                                    const targetId = selectedEntry.site_ids?.[0];
                                    if (targetId) onOpenSite(targetId);
                                }}
                                className="rounded-full px-8 py-6 text-md font-semibold shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                            >
                                Ver lugar relacionado <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="h-[72vh] bg-muted/20">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                <PanelBanner
                    panelKey="paquesepas"
                    defaultImage="/images/banners/unified/aprende-v2.webp"
                    gradientClass="from-indigo-50/95 via-indigo-50/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 dark:to-transparent"
                    icon={
                        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-md text-white">
                            <BookOpen className="h-6 w-6" />
                        </div>
                    }
                    titleClassName="text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-indigo-50"
                    defaultTitle={language === 'es' ? "Pa' que sepás" : 'Did you know?'}
                    defaultSubtitle={language === 'es' ? 'Aprende sobre la cultura, la historia y los secretos mejor guardados de la ciudad. El por qué importa lo que ves.' : 'Learn about the culture, history and best-kept secrets of the city. Why what you see matters.'}
                    andiTitle="Mirá la ciudad con otros ojos"
                    andiMessage="Cada historia puede cambiar la forma de recorrer un lugar. Elegí la que más te intrigue y, cuando salgas, buscá sus huellas en la ciudad."
                    andiActionLabel="Explorar historias"
                >
                    {/* Pregunta del día: ocupa el espacio libre del propio banner, sin agregar una fila. */}
                    <button
                        type="button"
                        onClick={() => setShowDaily(true)}
                        className="group flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/50 bg-white/75 px-4 py-2.5 text-left shadow-sm backdrop-blur-sm transition-all hover:bg-white/90 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:bg-slate-900/80"
                    >
                        <div className="shrink-0 rounded-xl bg-primary/15 p-2 text-primary"><CalendarDays className="h-5 w-5" /></div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold leading-tight">Pregunta del día</div>
                            <div className="truncate text-xs text-muted-foreground">Poné a prueba lo que sabés y sumá a tu racha 🔥</div>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                </PanelBanner>
                {showDaily && <DailyQuestion onClose={() => setShowDaily(false)} />}

                <section className="mb-8">
                    <div className="mb-4"><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Herramientas para aprender</p><h2 className="text-2xl font-bold">Explorá la ciudad desde distintas voces</h2></div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <button type="button" onClick={() => storiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-sky-500/10 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><BookOpen className="mb-3 h-6 w-6 text-indigo-600" /><h3 className="font-bold">Historias y saberes</h3><p className="mt-1 text-sm text-muted-foreground">Relatos, personajes y claves para entender lo que ves mientras andás.</p><span className="mt-3 inline-flex items-center text-xs font-bold text-indigo-700">Explorar historias <ChevronRight className="h-4 w-4" /></span></button>
                        {dictionaryVisible && <button type="button" onClick={onOpenDictionary} className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><Library className="mb-3 h-6 w-6 text-emerald-600" /><h3 className="font-bold">Diccionario de la caleñidad</h3><p className="mt-1 text-sm text-muted-foreground">Palabras, expresiones, usos y contextos para comprender cómo habla la ciudad.</p><span className="mt-3 inline-flex items-center text-xs font-bold text-emerald-700">Abrir diccionario <ChevronRight className="h-4 w-4" /></span></button>}
                        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/12 via-amber-500/10 to-rose-500/10 p-5"><Headphones className="mb-3 h-6 w-6 text-orange-600" /><h3 className="font-bold">Narraciones y audios</h3><p className="mt-1 text-sm text-muted-foreground">Próximamente: historias contadas para disfrutar mientras recorrés la ciudad.</p><span className="mt-3 inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-700">Próximamente</span></div>
                    </div>
                </section>

                <div ref={storiesRef} className="grid scroll-mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map(entry => (
                        <div 
                            key={entry.id} 
                            className="cursor-pointer group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-border/50 bg-card rounded-[1.5rem] shadow-sm flex flex-col"
                            onClick={() => setSelectedEntry(entry)}
                        >
                            {entry.image_url ? (
                                <div className="h-48 relative overflow-hidden bg-muted">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                    <img src={entry.image_url} alt={entry.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
                                        <MapPin className="w-3 h-3" /> {entry.city}
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-6 px-6 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                            <MapPin className="w-3 h-3" /> {entry.city}
                                        </div>
                                        <Quote className="w-5 h-5 text-muted-foreground/30" />
                                    </div>
                                </div>
                            )}

                            <div className="p-6 relative z-10 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight font-heading">
                                    {getTranslated(entry, 'title', language)}
                                </h3>
                                
                                <p className="text-muted-foreground/90 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow font-serif">
                                    {(getTranslated(entry, 'content_full', language) as string || getTranslated(entry, 'content_simple', language) as string || '').split('\n\n')[0]}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                                    <div className="flex flex-wrap gap-1.5">
                                        {entry.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                                        Leer <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="flex gap-4 mb-6">
                            <Footprints className="h-12 w-12 text-primary animate-[bounce_2s_infinite_-1s]" />
                            <Footprints className="h-12 w-12 text-primary animate-[bounce_2s_infinite] scale-x-[-1] mt-8" />
                        </div>
                        <p className="font-bold text-lg text-foreground animate-pulse">Andando por las calles...</p>
                        <p className="text-sm opacity-70 mt-1">Recopilando historias y saberes</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No hay historias disponibles aún para esta ciudad.</p>
                    </div>
                ) : null}
            </div>
        </ScrollArea>
    );
};

export default PaQueSepasPanel;
