import React, { useEffect, useState } from 'react';
import { Game, GameTheme, gamesService } from '../../services/games.service';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Gamepad2, Clock, Trophy, PlayCircle, CalendarDays, Info, Flame, Timer, ChevronRight, Music, Mic2, Headphones, Swords, Sparkles, MapPinned, Zap } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { LeaderboardPanel } from './LeaderboardPanel';
import GameInstructionsDialog from '../shared/GameInstructionsDialog';
import { GameMascot } from '../views/GameMascot';
import { GameCover, hasGameCover } from '../views/GameCover';
import { PanelBanner } from './shared/PanelBanner';
import { AndiGuia } from '../shared/AndiGuia';
import { LazyImage } from '../ui/lazy-image';
import { bannerService, Banner } from '../../services/banner.service';
import { analyticsService } from '../../services/analytics.service';
import { DailyQuestion } from '../views/DailyQuestion';
import { GamePresentationCard } from './GamePresentationCard';
import { isLegacyValleStandalone, isTriviaGo } from '../../lib/gameIdentity';

interface JuegosPanelProps {
    onPlayGame: (gameId: string, mode?: 'levels' | 'legend' | 'timed', theme?: string) => void;
}

export const JuegosPanel: React.FC<JuegosPanelProps> = ({ onPlayGame }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeInstructionsGame, setActiveInstructionsGame] = useState<Game | null>(null);
    const [modeChoiceGame, setModeChoiceGame] = useState<Game | null>(null);
    const [themeChoices, setThemeChoices] = useState<GameTheme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState('all');
    const [showDaily, setShowDaily] = useState(false);
    const [musicContent, setMusicContent] = useState<Banner | null>(null);
    const [storiesContent, setStoriesContent] = useState<Banner | null>(null);

    const launchGame = async (game: Game) => {
        // Instrumentación (Fase 0): intención de jugar / vista de elección de modo.
        analyticsService.trackEvent('game_mode_viewed', 'game', game.id, {
            game_type: game.type,
            has_mode_choice: game.type === 'trivia'
        });
        // Las trivias ofrecen elegir modo (corto por niveles / Leyenda). El resto arranca directo.
        if (game.type === 'trivia') {
            setSelectedTheme('all');
            setModeChoiceGame(game);
            setThemeChoices(await gamesService.getGameThemes(game.id));
        }
        else onPlayGame(game.id);
    };

    useEffect(() => {
        loadGames();
        Promise.all([
            bannerService.getBanner('entertainment_music'),
            bannerService.getBanner('entertainment_stories'),
        ]).then(([music, stories]) => {
            setMusicContent(music?.is_active ? music : null);
            setStoriesContent(stories?.is_active ? stories : null);
        });
    }, []);

    const loadGames = async () => {
        setLoading(true);
        // We fetch all games, then filter by public statuses
        const data = await gamesService.getAllGames();
        const publicGames = data
            .filter(g => g.status === 'published' || g.status === 'coming_soon' || g.status === 'scheduled')
            .filter(g => !isLegacyValleStandalone(g))
            .sort((a, b) => Number(isTriviaGo(b)) - Number(isTriviaGo(a)));
        setGames(publicGames);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 text-muted-foreground animate-pulse">
                Cargando desafíos...
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Gamepad2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">Aún no hay juegos disponibles</h3>
                <p className="text-muted-foreground max-w-md">
                    Estamos preparando nuevas trivias y desafíos para que pongas a prueba tus conocimientos sobre la cultura.
                </p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[72vh] bg-[radial-gradient(circle_at_8%_18%,rgba(139,92,246,0.1),transparent_24%),radial-gradient(circle_at_92%_35%,rgba(249,115,22,0.1),transparent_25%),linear-gradient(to_bottom,rgba(168,85,247,0.04),transparent)]">
            <div className="relative mx-auto max-w-7xl space-y-4 overflow-hidden p-3 pb-16 md:p-5 md:pb-16 lg:p-6 lg:pb-20">
                <div className="pointer-events-none absolute -left-20 top-64 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 top-96 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
                <PanelBanner
                    panelKey="juegos"
                    defaultImage="/images/banners/unified/entretenimiento-v2.webp"
                    gradientClass="from-purple-50/95 via-purple-50/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 dark:to-transparent"
                    icon={
                        <div className="bg-purple-600 p-2.5 rounded-2xl shadow-md text-white">
                            <Gamepad2 className="h-6 w-6" />
                        </div>
                    }
                    titleClassName="text-2xl font-black tracking-tight text-purple-950 dark:text-purple-50 md:text-3xl"
                    defaultTitle="Entretenimiento"
                    defaultSubtitle="Elige una aventura, reta lo que sabes y convierte cada respuesta en un nuevo descubrimiento."
                    marginClass="mx-0"
                    compact
            />

            <Tabs defaultValue="juegos" className="relative z-10 w-full">
                <div className="mb-4 grid items-center gap-3 rounded-2xl border border-purple-500/10 bg-background/80 p-2.5 shadow-sm backdrop-blur lg:grid-cols-[minmax(0,1fr)_auto]">
                    <ScrollArea className="w-full">
                        <TabsList className="inline-flex h-auto w-max items-center gap-1 rounded-xl bg-purple-500/5 p-1">
                            <TabsTrigger value="juegos" className="flex-none gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                                <Gamepad2 className="h-4 w-4" /> Juegos
                            </TabsTrigger>
                            <TabsTrigger value="musica" className="flex-none gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white">
                                <Music className="h-4 w-4" /> Música
                            </TabsTrigger>
                            <TabsTrigger value="podcasts" className="flex-none gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                                <Mic2 className="h-4 w-4" /> Relatos
                            </TabsTrigger>
                            <TabsTrigger value="podio" className="flex-none gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-amber-500 data-[state=active]:text-amber-950">
                                <Trophy className="h-4 w-4" /> Salón de la Fama
                            </TabsTrigger>
                        </TabsList>
                    </ScrollArea>
                    <div className="shrink-0 self-end lg:self-auto">
                        <AndiGuia message="No necesitas saberlo todo: elige una experiencia, sigue tu curiosidad y descubre hasta dónde llegas." variant="tip" />
                    </div>
                </div>
                
                <TabsContent value="juegos" className="mt-0">
                    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[23rem_minmax(0,1fr)]">
                {games.map(game => {
                    const isUpcoming = game.status === 'coming_soon' || game.status === 'scheduled';
                    const triviaGo = isTriviaGo(game);

                    if (triviaGo) {
                        return (
                            <GamePresentationCard
                                key={game.id}
                                game={game}
                                imageSrc="/images/games/trivia-go-andi-card-v1.png"
                                title="TRIVIA GO"
                                description="Viaja por ciudades y regiones, elige tu desafío y descubre algo inesperado en cada respuesta junto a Andi."
                                onInstructions={() => setActiveInstructionsGame(game)}
                                onPlay={() => launchGame(game)}
                            />
                        );
                    }

                    // Portada ilustrada propia (SVG) si el juego trae una para su theme_pattern.
                    const illustratedCover = !game.cover_image_url && hasGameCover(game.theme_pattern);
                    // Identidad visual por juego: si el juego define theme_accent, se usa ese color (inline style,
                    // no depende de que Tailwind haya generado la clase en build). Si no, se cae al cover_theme clásico.
                    const bgTheme = (!game.theme_accent && !illustratedCover) ? (game.cover_theme || 'bg-primary/10') : '';
                    const headerStyle = (game.theme_accent && !illustratedCover) ? { backgroundColor: game.theme_accent_soft || `${game.theme_accent}22` } : undefined;
                    const overCover = !!game.cover_image_url || illustratedCover; // título en blanco sobre arte
                    const titleStyle = (!overCover && game.theme_accent) ? { color: game.theme_accent } : undefined;
                    return (
                    <Card key={game.id} className="flex h-full max-w-[23rem] flex-col overflow-hidden rounded-[1.45rem] border-2 border-purple-500/15 bg-card/95 backdrop-blur transition-all hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10">
                        <div className={`${overCover ? 'h-28' : 'min-h-[7.5rem] h-auto'} relative flex flex-col items-center justify-center p-3.5 overflow-hidden ${bgTheme}`} style={headerStyle}>
                            {game.cover_image_url && (
                                <>
                                    <div className="absolute inset-0 bg-black/40 z-10" />
                                    <LazyImage src={game.cover_image_url} alt={game.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </>
                            )}
                            {illustratedCover && (
                                <GameCover pattern={game.theme_pattern} className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700" />
                            )}
                            <div className="text-center relative z-20 flex flex-col items-center justify-center w-full">
                                {isUpcoming && (
                                    <div className="bg-yellow-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase flex items-center gap-1 shadow-sm mb-1.5 tracking-wider inline-flex">
                                        {game.show_countdown && game.release_at ? (
                                            <><Clock className="w-3 h-3" /> Faltan {Math.max(1, Math.ceil((new Date(game.release_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} días</>
                                        ) : (
                                            <><CalendarDays className="w-3 h-3" /> Próximamente</>
                                        )}
                                    </div>
                                )}
                                {!overCover && game.theme_icon && (
                                    <div className="mb-1.5 flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: `${game.theme_accent || '#10B981'}22` }}>
                                        <GameMascot icon={game.theme_icon} accent={game.theme_accent} size={31} />
                                    </div>
                                )}
                                <h3 className={`text-base sm:text-lg font-black drop-shadow-md line-clamp-2 uppercase tracking-tight leading-tight ${overCover ? 'text-white' : 'text-primary'}`} style={titleStyle}>
                                    {game.cover_title?.trim() || game.title?.trim() || 'Juego cultural'}
                                </h3>
                                {(game.cover_subtitle) && (
                                    <p className={`text-[10px] font-bold mt-1 tracking-wide line-clamp-1 ${overCover ? 'text-white/90' : 'text-foreground/80'}`}>
                                        {game.cover_subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        <CardContent className="flex flex-1 flex-col p-3.5">
                            <p className="mb-3 flex-1 text-[0.82rem] leading-relaxed text-muted-foreground line-clamp-2">
                                {game.description || 'Pon a prueba tus conocimientos en este desafío especial.'}
                            </p>
                            
                            <div className="mb-3 grid grid-cols-2 gap-2 text-xs font-medium text-muted-foreground">
                                <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 p-2">
                                    <Zap className="h-4 w-4 text-primary" />
                                    <span>{game.difficulty_level === 'easy' ? 'Fácil' : game.difficulty_level === 'medium' ? 'Media' : game.difficulty_level === 'hard' ? 'Difícil' : 'Variable'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/50 p-2 rounded-lg">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span>{game.base_points_reward} Puntos</span>
                                </div>
                            </div>
                            
                            {game.status === 'published' ? (
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <Button 
                                        variant="outline" 
                                        className="shadow-md hover:shadow-lg transition-shadow bg-background"
                                        onClick={() => setActiveInstructionsGame(game)}
                                        title="Cómo Jugar"
                                    >
                                        <Info className="w-4 h-4 mr-2 text-primary" /> Cómo jugar
                                    </Button>
                                    <Button
                                        className="shadow-md hover:shadow-lg transition-shadow group-hover:bg-primary/90"
                                        onClick={() => launchGame(game)}
                                    >
                                        <PlayCircle className="w-5 h-5 mr-2" />
                                        Jugar
                                    </Button>
                                </div>
                            ) : (
                                    <Button className="w-full shadow-md" disabled variant="secondary">
                                        En Preparación
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
                        <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <button
                                type="button"
                                onClick={() => setShowDaily(true)}
                                className="group flex min-h-[7.2rem] items-center gap-4 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-50 via-orange-50 to-fuchsia-50 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-lg dark:from-amber-950/30 dark:via-orange-950/20 dark:to-fuchsia-950/20"
                            >
                                <div className="relative rounded-2xl bg-amber-400 p-3 text-amber-950 shadow-md">
                                    <CalendarDays className="h-6 w-6" />
                                    <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-fuchsia-500 ring-2 ring-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">Vuelve cada día</p>
                                    <h3 className="mt-0.5 font-black text-foreground">Pregunta del día</h3>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Responde la de hoy y mantén viva tu racha.</p>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-orange-500 transition-transform group-hover:translate-x-1" />
                            </button>

                            <div className="relative min-h-[7.2rem] overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 p-4 text-white shadow-sm">
                                <Sparkles className="absolute -right-3 -top-3 h-20 w-20 text-white/10" />
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-100">Tú eliges el ritmo</p>
                                <h3 className="mt-1 font-black">Tres formas de jugar</h3>
                                <div className="mt-3 flex flex-wrap gap-1.5 text-[0.68rem] font-bold">
                                    <span className="rounded-full bg-white/15 px-2.5 py-1">🔥 Leyenda</span>
                                    <span className="rounded-full bg-white/15 px-2.5 py-1">⏱ Contrarreloj</span>
                                    <span className="rounded-full bg-white/15 px-2.5 py-1">⚔️ Duelo</span>
                                </div>
                            </div>

                            <div className="flex min-h-[7.2rem] items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700"><MapPinned className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Explora por experiencia</p>
                                    <h3 className="mt-1 font-black text-foreground">El Valle ahora está dentro de TRIVIA GO</h3>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Al jugar podrás elegir la selección general, Valle del Cauca o vocabulario caleño.</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </TabsContent>
                
                <TabsContent value="musica">
                    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950 via-purple-900 to-indigo-900 p-8 text-white shadow-xl">
                        <Music className="mb-5 h-10 w-10 text-fuchsia-300" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-200">Música para andar</p>
                        <h3 className="mt-2 text-3xl font-black">{musicContent?.title_es || 'Una playlist para cada recorrido'}</h3>
                        <p className="mt-3 max-w-2xl text-white/80">{musicContent?.subtitle_es || 'Muy pronto vas a encontrar selecciones musicales para ponerle ritmo a tus caminatas, visitas y rutas.'}</p>
                        <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold"><Headphones className="mr-2 h-4 w-4" /> Próximamente</div>
                    </div>
                </TabsContent>

                <TabsContent value="podcasts">
                    <div className="rounded-3xl border border-dashed border-orange-500/30 bg-orange-500/5 p-8 text-center">
                        <Mic2 className="mx-auto mb-4 h-10 w-10 text-orange-500" />
                        <h3 className="text-2xl font-bold">{storiesContent?.title_es || 'Relatos, pódcast y voces de la ciudad'}</h3>
                        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{storiesContent?.subtitle_es || 'Muy pronto podrás escuchar historias, voces y relatos que le dan vida a Cali mientras andás.'}</p>
                        <span className="mt-5 inline-block rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-700">Próximamente</span>
                    </div>
                </TabsContent>

                <TabsContent value="podio">
                    <LeaderboardPanel />
                </TabsContent>
            </Tabs>

            {activeInstructionsGame && (
                <GameInstructionsDialog
                    open={!!activeInstructionsGame}
                    onOpenChange={(open) => !open && setActiveInstructionsGame(null)}
                    game={activeInstructionsGame}
                    onPlay={() => launchGame(activeInstructionsGame)}
                />
            )}

            <Dialog open={!!modeChoiceGame} onOpenChange={(open) => !open && setModeChoiceGame(null)}>
                <DialogContent className="max-h-[92vh] max-w-md overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>¿Cómo querés jugar?</DialogTitle>
                        <DialogDescription>Elige una experiencia y después tu modo de juego.</DialogDescription>
                    </DialogHeader>
                    {themeChoices.some(theme => theme.isCampaign) && (
                        <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Experiencia</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTheme('all')}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${selectedTheme === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/50'}`}
                                >
                                    Selección general
                                </button>
                                {themeChoices.filter(theme => theme.isCampaign).map(theme => (
                                    <button
                                        key={theme.key}
                                        type="button"
                                        onClick={() => setSelectedTheme(theme.key)}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${selectedTheme === theme.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/50'}`}
                                    >
                                        {theme.label}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">La experiencia elegida se aplica a Leyenda y Contrarreloj. En Duelo, las preguntas pueden mezclar todos los recorridos.</p>
                        </div>
                    )}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) onPlayGame(g.id, 'legend', selectedTheme); }}
                            className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-orange-500 hover:bg-orange-500/5"
                        >
                            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500"><Flame className="h-6 w-6" /></div>
                            <div className="flex-1">
                                <div className="font-bold">Modo Leyenda</div>
                                <div className="text-sm text-muted-foreground">Nivel tras nivel, sin final a la vista y solo 3 vidas. Pocos llegan lejos… ¿te la jugás por ser leyenda?</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) onPlayGame(g.id, 'timed', selectedTheme); }}
                            className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-sky-500 hover:bg-sky-500/5"
                        >
                            <div className="rounded-xl bg-sky-500/10 p-3 text-sky-500"><Timer className="h-6 w-6" /></div>
                            <div className="flex-1">
                                <div className="font-bold">Contrarreloj</div>
                                <div className="text-sm text-muted-foreground">2 minutos, 15 preguntas y un solo error te saca. Llegá al final y duplicás todo. ¿Le corrés al reloj?</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) window.dispatchEvent(new CustomEvent('start-duel', { detail: { gameId: g.id } })); }}
                            className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                        >
                            <div className="rounded-xl bg-primary/10 p-3 text-primary"><Swords className="h-6 w-6" /></div>
                            <div className="flex-1">
                                <div className="font-bold">Duelo · Retar a un amigo</div>
                                <div className="text-sm text-muted-foreground">10 preguntas, 25s cada una y 3 minutos en total. Jugás vos primero y luego mandás el reto: gana quien más sepa.</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {showDaily && <DailyQuestion onClose={() => setShowDaily(false)} />}
            </div>
        </ScrollArea>
    );
};
