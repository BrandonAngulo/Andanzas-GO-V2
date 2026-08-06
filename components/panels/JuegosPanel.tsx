import React, { useEffect, useState } from 'react';
import { Game, GameTheme, gamesService, type GameSessionMode } from '../../services/games.service';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Gamepad2, Clock, Trophy, PlayCircle, CalendarDays, Info, Timer, ChevronRight, ChevronLeft, Music, Mic2, Headphones, Swords, Sparkles, MapPinned, Zap, Globe2, Languages } from 'lucide-react';
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
import { imagePositionStyle } from '../shared/ImagePositioner';
import { bannerService, Banner } from '../../services/banner.service';
import { analyticsService } from '../../services/analytics.service';
import { DailyQuestion } from '../views/DailyQuestion';
import { WeeklyGoals } from '../views/WeeklyGoals';
import { modifierService, GameModifier } from '../../services/modifier.service';
import { GamePresentationCard } from './GamePresentationCard';
import { isLegacyValleStandalone, isTriviaGo } from '../../lib/gameIdentity';
import { AdventureExperience } from './AdventureExperience';
import { PlaceModeHub } from './game-modes/PlaceModeHub';
import { TimedModeHub } from './game-modes/TimedModeHub';
import { DuelModeHub } from './game-modes/DuelModeHub';
import { ClassicModeHub } from './game-modes/ClassicModeHub';
import { VocabularyModeHub } from './game-modes/VocabularyModeHub';

interface JuegosPanelProps {
    onPlayGame: (gameId: string, mode?: 'levels' | 'legend' | 'timed', theme?: string, sessionMode?: GameSessionMode) => void;
}

export const JuegosPanel: React.FC<JuegosPanelProps> = ({ onPlayGame }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeInstructionsGame, setActiveInstructionsGame] = useState<Game | null>(null);
    const [modeChoiceGame, setModeChoiceGame] = useState<Game | null>(null);
    const [adventureGame, setAdventureGame] = useState<Game | null>(null);
    const [placeHubGame, setPlaceHubGame] = useState<Game | null>(null);
    const [timedHubGame, setTimedHubGame] = useState<Game | null>(null);
    const [duelHubGame, setDuelHubGame] = useState<Game | null>(null);
    const [classicHubGame, setClassicHubGame] = useState<Game | null>(null);
    const [vocabularyHubGame, setVocabularyHubGame] = useState<Game | null>(null);
    const [themeChoices, setThemeChoices] = useState<GameTheme[]>([]);
    const [modeMenuView, setModeMenuView] = useState<'modes' | 'places'>('modes');
    const [showDaily, setShowDaily] = useState(false);
    const [activeModifier, setActiveModifier] = useState<GameModifier | null>(null);
    useEffect(() => { modifierService.getActive().then(setActiveModifier); }, []);
    const [musicContent, setMusicContent] = useState<Banner | null>(null);
    const [storiesContent, setStoriesContent] = useState<Banner | null>(null);

    const launchGame = async (game: Game) => {
        // Instrumentación (Fase 0): intención de jugar / vista de elección de modo.
        analyticsService.trackEvent('game_mode_viewed', 'game', game.id, {
            game_type: game.type,
            has_mode_choice: game.type === 'trivia'
        });
        // Las trivias ofrecen un selector directo de modos y recorridos temáticos.
        if (game.type === 'trivia') {
            setModeMenuView('modes');
            setModeChoiceGame(game);
            setThemeChoices(await gamesService.getGameThemes(game.id));
        }
        else onPlayGame(game.id);
    };

    const openPlaceHub = async (game: Game) => {
        const themes = await gamesService.getGameThemes(game.id);
        setThemeChoices(themes);
        setModeChoiceGame(null);
        setPlaceHubGame(game);
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
        <ScrollArea className="h-full bg-[radial-gradient(circle_at_8%_18%,rgba(139,92,246,0.1),transparent_24%),radial-gradient(circle_at_92%_35%,rgba(249,115,22,0.1),transparent_25%),linear-gradient(to_bottom,rgba(168,85,247,0.04),transparent)]">
            <div className="relative mx-auto max-w-[92rem] space-y-4 overflow-hidden p-3 pb-16 md:p-5 md:pb-16 lg:pb-16">
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
                        <AndiGuia
                            title="Elegí cómo querés jugar"
                            message="Cada modo propone un viaje distinto. Empezá por el que más te intrigue: no hace falta saberlo todo, porque cada respuesta también te revela algo nuevo."
                            actionLabel="Elegir mi juego"
                            variant="tip"
                        />
                    </div>
                </div>
                
                <TabsContent value="juegos" className="mt-0">
                    {activeModifier && (
                        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-orange-500/15 px-4 py-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950"><Zap className="h-5 w-5" /></span>
                            <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">Regla especial de la semana</div>
                                <div className="font-bold leading-tight">{activeModifier.label}</div>
                                <div className="text-xs text-muted-foreground">{activeModifier.description}</div>
                            </div>
                        </div>
                    )}
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
                                description="Recorre el mundo con preguntas de cultura, ciencia, lugares e historias. Elige un modo y descubre algo nuevo con Andi."
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
                                    <LazyImage src={game.cover_image_url} alt={game.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={imagePositionStyle((game as any).image_position)} />
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
                        <aside className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                            <button
                                type="button"
                                onClick={() => setShowDaily(true)}
                                className="group flex min-h-[5rem] items-center gap-3 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-50 via-orange-50 to-fuchsia-50 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-lg dark:from-amber-950/30 dark:via-orange-950/20 dark:to-fuchsia-950/20"
                            >
                                <div className="relative rounded-xl bg-amber-400 p-2.5 text-amber-950 shadow-md">
                                    <CalendarDays className="h-5 w-5" />
                                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-fuchsia-500 ring-2 ring-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">Vuelve cada día</p>
                                    <h3 className="mt-0.5 font-black text-foreground">Pregunta del día</h3>
                                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Responde la de hoy y mantén viva tu racha.</p>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-orange-500 transition-transform group-hover:translate-x-1" />
                            </button>

                            {/* Metas semanales flexibles: progreso real, reclamo de monedas. */}
                            <div className="sm:col-span-2 lg:col-span-1"><WeeklyGoals /></div>

                            <button type="button" onClick={() => { const g = games.find(isTriviaGo); if (g) setAdventureGame(g); }} className="group relative min-h-[5rem] overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 p-3 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                                <Sparkles className="absolute -right-2 -top-4 h-16 w-16 text-white/10" />
                                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-100">Modo principal</p>
                                <div className="mt-0.5 flex items-center justify-between gap-3"><div><h3 className="font-black">Continuar Aventura</h3><p className="mt-0.5 text-[11px] text-white/70">Vuelve al mapa de Sabores de Cali.</p></div><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1"><ChevronRight className="h-5 w-5" /></span></div>
                            </button>

                            <button type="button" onClick={() => { const g = games.find(isTriviaGo); if (g) openPlaceHub(g); }} className="group flex min-h-[5rem] items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40 sm:col-span-2 lg:col-span-1">
                                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><MapPinned className="h-5 w-5" /></div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700">El mundo también se juega</p>
                                    <h3 className="mt-0.5 truncate font-black text-foreground">Jugar por lugar</h3>
                                    <p className="mt-0.5 line-clamp-1 text-xs leading-tight text-muted-foreground">Cali, el Valle, Colombia y el mundo.</p>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-1" />
                            </button>
                        </aside>
                    </div>
                </TabsContent>
                
                <TabsContent value="musica">
                    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950 via-purple-900 to-indigo-900 p-5 text-white shadow-xl sm:p-8">
                        <Music className="mb-4 h-9 w-9 text-fuchsia-300 sm:mb-5 sm:h-10 sm:w-10" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-200">Música para andar</p>
                        <h3 className="mt-2 text-2xl font-black sm:text-3xl">{musicContent?.title_es || 'Una playlist para cada recorrido'}</h3>
                        <p className="mt-3 max-w-2xl text-white/80">{musicContent?.subtitle_es || 'Muy pronto vas a encontrar selecciones musicales para ponerle ritmo a tus caminatas, visitas y rutas.'}</p>
                        <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold"><Headphones className="mr-2 h-4 w-4" /> Próximamente</div>
                    </div>
                </TabsContent>

                <TabsContent value="podcasts">
                    <div className="rounded-3xl border border-dashed border-orange-500/30 bg-orange-500/5 p-5 text-center sm:p-8">
                        <Mic2 className="mx-auto mb-4 h-9 w-9 text-orange-500 sm:h-10 sm:w-10" />
                        <h3 className="text-xl font-bold sm:text-2xl">{storiesContent?.title_es || 'Relatos, pódcast y voces de la ciudad'}</h3>
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
                <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto p-0 [&>button]:right-3 [&>button]:top-3 [&>button]:z-30 [&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-slate-200 [&>button]:bg-white [&>button]:text-[#073c43] [&>button]:opacity-100 [&>button]:shadow-lg [&>button]:transition-transform [&>button:hover]:scale-105">
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#073c43] via-[#08705d] to-[#14a866] px-5 py-4 text-white">
                        <DialogHeader className="max-w-[68%] text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">Andi te acompaña</p>
                            <DialogTitle className="mt-1 text-2xl font-black text-white">
                                {modeMenuView === 'places' ? 'Elige un lugar' : 'Elige un modo de juego'}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm text-white/80">
                                {modeMenuView === 'places'
                                    ? '¿De qué parte del mundo quieres poner a prueba tus conocimientos?'
                                    : 'Una elección y listo: cada partida tiene su propio ritmo.'}
                            </DialogDescription>
                        </DialogHeader>
                        <img
                            src="/brand/andi/andi-app-mark-512.png"
                            alt="Andi te ayuda a elegir una partida."
                            className="absolute -bottom-3 right-3 h-28 w-28 rounded-full object-cover shadow-2xl ring-2 ring-white/30"
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                    <div className="space-y-2.5 p-4">
                    {modeMenuView === 'places' ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setModeMenuView('modes')}
                                className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="h-4 w-4" /> Volver a los modos
                            </button>
                            {themeChoices.filter(theme => theme.kind === 'place').map(theme => (
                                <button
                                    key={theme.key}
                                    type="button"
                                    onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) onPlayGame(g.id, 'levels', theme.key, 'lugar'); }}
                                    className="flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors hover:border-emerald-500 hover:bg-emerald-500/5"
                                >
                                    <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600"><MapPinned className="h-5 w-5" /></div>
                                    <div className="flex-1">
                                        <div className="font-bold">¿Qué tanto sabes de {theme.label}?</div>
                                        <div className="text-xs text-muted-foreground">15 preguntas para recorrer sus lugares, historias y cultura.</div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </button>
                            ))}
                        </>
                    ) : (
                        <>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) setAdventureGame(g); }}
                            className="group relative flex min-h-[8.5rem] w-full items-center overflow-hidden rounded-[1.4rem] border-2 border-amber-300/70 bg-gradient-to-r from-amber-50 via-[#fff9e9] to-emerald-50 text-left text-[#073c43] shadow-[0_10px_28px_rgba(7,60,67,0.16)] transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-[0_15px_34px_rgba(7,60,67,0.23)]"
                        >
                            <div className="relative ml-3 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-amber-300/70 sm:h-28 sm:w-28">
                                <img src="/images/games/trivia-go/aventura-sabores-cali-game-map-v4.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_28%] transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-[#073c43]/10" />
                            </div>
                            <img src="/images/games/trivia-go/andi-adventure-guide-v1.png" alt="Andi te invita al modo Aventura" className="absolute -bottom-4 left-8 z-10 h-[7.2rem] w-[7.2rem] object-contain drop-shadow-xl transition-transform group-hover:-translate-y-1" />
                            <div className="relative z-10 min-w-0 flex-1 p-3.5 pl-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.15em] text-amber-950"><Sparkles className="h-3 w-3" /> Modo principal</span>
                                <div className="mt-1.5 text-xl font-black leading-none">Aventura</div>
                                <div className="mt-1 text-xs font-medium leading-relaxed text-slate-600">10 niveles, una categoría por dominar y nuevos amigos por descubrir.</div>
                                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#08705d]">Entrar al mapa <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) setClassicHubGame(g); }}
                            className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
                        >
                            <Globe2 className="absolute -right-2 -top-3 h-20 w-20 text-emerald-600/[0.07]" />
                            <div className="relative rounded-xl bg-emerald-600 p-2.5 text-white shadow"><Globe2 className="h-5 w-5" /></div>
                            <div className="relative flex-1">
                                <div className="text-[8px] font-black uppercase tracking-[0.15em] text-emerald-700">Explora sin límites</div>
                                <div className="font-bold">Partida clásica</div>
                                <div className="text-xs text-muted-foreground">15 preguntas para viajar por culturas, ciencia, historia y lugares del mundo.</div>
                            </div>
                            <ChevronRight className="relative h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) setTimedHubGame(g); }}
                            className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md"
                        >
                            <Timer className="absolute -right-2 -top-3 h-20 w-20 text-sky-600/[0.07]" />
                            <div className="relative rounded-xl bg-sky-500 p-2.5 text-white shadow"><Timer className="h-5 w-5" /></div>
                            <div className="relative flex-1">
                                <div className="text-[8px] font-black uppercase tracking-[0.15em] text-sky-700">Piensa rápido</div>
                                <div className="font-bold">Contrarreloj</div>
                                <div className="text-xs text-muted-foreground">2 minutos, 15 preguntas y un solo error: piensa rápido y llega al final.</div>
                            </div>
                            <ChevronRight className="relative h-5 w-5 text-sky-600 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) setDuelHubGame(g); }}
                            className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-rose-50/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md"
                        >
                            <Swords className="absolute -right-2 -top-3 h-20 w-20 text-violet-600/[0.07]" />
                            <div className="relative rounded-xl bg-violet-600 p-2.5 text-white shadow"><Swords className="h-5 w-5" /></div>
                            <div className="relative flex-1">
                                <div className="text-[8px] font-black uppercase tracking-[0.15em] text-violet-700">Reta a alguien</div>
                                <div className="font-bold">Duelo</div>
                                <div className="text-xs text-muted-foreground">Responde 10 preguntas, comparte el reto y descubre quién conoce más.</div>
                            </div>
                            <ChevronRight className="relative h-5 w-5 text-violet-600 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { const g = modeChoiceGame; if (g) openPlaceHub(g); }}
                            className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md"
                        >
                            <MapPinned className="absolute -right-2 -top-3 h-20 w-20 text-orange-600/[0.07]" />
                            <div className="relative rounded-xl bg-orange-500 p-2.5 text-white shadow"><MapPinned className="h-5 w-5" /></div>
                            <div className="relative flex-1">
                                <div className="text-[8px] font-black uppercase tracking-[0.15em] text-orange-700">Elige un destino</div>
                                <div className="font-bold">Jugar por lugar</div>
                                <div className="text-xs text-muted-foreground">Elige un país, una región o una ciudad y demuestra cuánto conoces.</div>
                            </div>
                            <ChevronRight className="relative h-5 w-5 text-orange-600 transition-transform group-hover:translate-x-1" />
                        </button>
                        {themeChoices.filter(theme => theme.kind === 'topic').map(theme => (
                            <button
                                key={theme.key}
                                type="button"
                                onClick={() => { const g = modeChoiceGame; setModeChoiceGame(null); if (g) setVocabularyHubGame(g); }}
                                className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-violet-50/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-fuchsia-400 hover:shadow-md"
                            >
                                <Languages className="absolute -right-2 -top-3 h-20 w-20 text-fuchsia-600/[0.07]" />
                                <div className="relative rounded-xl bg-fuchsia-600 p-2.5 text-white shadow"><Languages className="h-5 w-5" /></div>
                                <div className="relative flex-1">
                                    <div className="text-[8px] font-black uppercase tracking-[0.15em] text-fuchsia-700">Habla como en Cali</div>
                                    <div className="font-bold">{theme.label}</div>
                                    <div className="text-xs text-muted-foreground">Palabras y expresiones para hablar como se habla en Cali.</div>
                                </div>
                                <ChevronRight className="relative h-5 w-5 text-fuchsia-600 transition-transform group-hover:translate-x-1" />
                            </button>
                        ))}
                        </>
                    )}
                    </div>
                </DialogContent>
            </Dialog>

            {showDaily && <DailyQuestion onClose={() => setShowDaily(false)} />}
            {adventureGame && <AdventureExperience gameId={adventureGame.id} onClose={() => setAdventureGame(null)} />}
            {classicHubGame && <ClassicModeHub game={classicHubGame} onClose={() => setClassicHubGame(null)} onPlay={() => { const g = classicHubGame; setClassicHubGame(null); if (g) onPlayGame(g.id, 'levels', undefined, 'clasica'); }} />}
            {placeHubGame && <PlaceModeHub game={placeHubGame} themes={themeChoices} onClose={() => setPlaceHubGame(null)} onPlay={(theme) => { const g = placeHubGame; setPlaceHubGame(null); if (g) onPlayGame(g.id, 'levels', theme.key, 'lugar'); }} />}
            {timedHubGame && <TimedModeHub game={timedHubGame} modifier={activeModifier} onClose={() => setTimedHubGame(null)} onPlay={() => { const g = timedHubGame; setTimedHubGame(null); if (g) onPlayGame(g.id, 'timed', undefined, 'contrarreloj'); }} />}
            {duelHubGame && <DuelModeHub game={duelHubGame} onClose={() => setDuelHubGame(null)} onStart={() => { const g = duelHubGame; setDuelHubGame(null); if (g) window.dispatchEvent(new CustomEvent('start-duel', { detail: { gameId: g.id } })); }} />}
            {vocabularyHubGame && <VocabularyModeHub game={vocabularyHubGame} onClose={() => setVocabularyHubGame(null)} onPlay={() => { const g = vocabularyHubGame; setVocabularyHubGame(null); if (g) onPlayGame(g.id, 'levels', 'vocabulario', 'vocabulario'); }} />}
            </div>
        </ScrollArea>
    );
};
