import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Flag,
    Flame,
    Heart,
    Lightbulb,
    MapPinned,
    PlayCircle,
    ShieldAlert,
    Skull,
    Sparkles,
    Swords,
    Timer,
    Trophy,
} from 'lucide-react';
import { Game } from '../../services/games.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { isTriviaGo } from '../../lib/gameIdentity';

interface GameInstructionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game: Game;
    onPlay?: () => void;
}

const GameInstructionsDialog: React.FC<GameInstructionsDialogProps> = ({
    open,
    onOpenChange,
    game,
    onPlay,
}) => {
    const triviaGo = isTriviaGo(game);
    
    // Determine mechanic configuration
    let mechanicIcon = <Flag className="w-8 h-8 text-green-500" />;
    let mechanicTitle = "Zonas Seguras";
    let mechanicDesc = "Tu progreso se asegura cada 5 preguntas. Si pierdes antes de llegar a una zona segura, tu racha y puntaje vuelven al último punto guardado.";
    let mechanicBg = "bg-green-500/10";
    let mechanicBorder = "border-green-500/30";

    if (game.mechanic_type === 'lives') {
        mechanicIcon = <Heart className="w-8 h-8 text-red-500 fill-red-500" />;
        mechanicTitle = `Tienes ${game.lives_count || 3} Vidas`;
        mechanicDesc = "Cada respuesta incorrecta o tiempo agotado te restará una vida. ¡Si las pierdes todas, se acabó el juego!";
        mechanicBg = "bg-red-500/10";
        mechanicBorder = "border-red-500/30";
    } else if (game.mechanic_type === 'multiplier') {
        mechanicIcon = <Flame className="w-8 h-8 text-orange-500" />;
        mechanicTitle = "Multiplicador Arcade";
        mechanicDesc = "Encadena respuestas correctas para multiplicar tus puntos (hasta x5). Si fallas, no pierdes puntos base, ¡pero tu racha vuelve a cero!";
        mechanicBg = "bg-orange-500/10";
        mechanicBorder = "border-orange-500/30";
    } else if (game.mechanic_type === 'sudden_death') {
        mechanicIcon = <Skull className="w-8 h-8 text-purple-500" />;
        mechanicTitle = "Muerte Súbita";
        mechanicDesc = "No hay margen de error. Una sola respuesta incorrecta o tiempo agotado y tu partida terminará instantáneamente.";
        mechanicBg = "bg-purple-500/10";
        mechanicBorder = "border-purple-500/30";
    }

    const handlePlay = () => {
        onOpenChange(false);
        onPlay?.();
    };

    if (triviaGo) {
        const steps = [
            {
                icon: CheckCircle2,
                title: 'Elige tu respuesta',
                description: 'Lee la pregunta y confía en lo que sabes.',
                color: 'text-emerald-600',
                surface: 'bg-emerald-50',
            },
            {
                icon: Lightbulb,
                title: 'Descubre algo nuevo',
                description: 'Cada respuesta te cuenta algo que vale la pena recordar.',
                color: 'text-amber-600',
                surface: 'bg-amber-50',
            },
            {
                icon: Trophy,
                title: 'Suma y avanza',
                description: 'Encadena aciertos, avanza y descubre hasta dónde puedes llegar.',
                color: 'text-violet-600',
                surface: 'bg-violet-50',
            },
        ];

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[2rem] border-emerald-950/10 bg-[#fbfaf6] p-0 shadow-2xl sm:max-w-3xl">
                    <div className="relative min-h-[10.5rem] overflow-hidden bg-gradient-to-br from-[#063b42] via-[#086052] to-[#10a866] px-6 py-5 text-white sm:px-8">
                        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute left-28 top-12 h-28 w-28 rounded-full border border-amber-300/20" />
                        <DialogHeader className="relative z-10 mb-0 max-w-[67%] text-left">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                                Andi te acompaña
                            </p>
                            <DialogTitle className="mt-2 text-3xl font-black leading-tight text-white">
                                Jugar es descubrir
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-sm font-medium leading-relaxed text-white/85">
                                Elige tu ritmo, recorre nuevos lugares y deja que cada pregunta te lleve más lejos.
                            </DialogDescription>
                        </DialogHeader>
                        <img
                            src="/brand/andi/andi-frontal-512-transparent-v2.png"
                            alt="Andi presenta las instrucciones de TRIVIA GO."
                            className="absolute -bottom-3 right-2 h-[10.5rem] w-auto object-contain drop-shadow-2xl sm:right-7 sm:h-[11.5rem]"
                            loading="eager"
                            decoding="async"
                        />
                    </div>

                    <div className="space-y-4 p-5 sm:p-6">
                        <Tabs defaultValue="como" className="w-full">
                            <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-emerald-950/5 p-1">
                                <TabsTrigger value="como" className="rounded-xl px-2 py-2.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-900">
                                    Cómo funciona
                                </TabsTrigger>
                                <TabsTrigger value="modos" className="rounded-xl px-2 py-2.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-900">
                                    Modos
                                </TabsTrigger>
                                <TabsTrigger value="lugares" className="rounded-xl px-2 py-2.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-900">
                                    Lugares y temas
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="como" className="mt-4">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        return (
                                            <div key={step.title} className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-3 sm:block">
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.surface}`}>
                                                        <Icon className={`h-5 w-5 ${step.color}`} />
                                                    </div>
                                                    <div className="sm:mt-3">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paso {index + 1}</p>
                                                        <h4 className="mt-0.5 text-sm font-black text-emerald-950">{step.title}</h4>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </TabsContent>

                            <TabsContent value="modos" className="mt-4">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                        { icon: Flame, title: 'Historia', text: 'Avanza capítulo a capítulo, protege tus 3 vidas y enfrenta preguntas cada vez más exigentes.', style: 'bg-orange-50 text-orange-600' },
                                        { icon: Timer, title: 'Contrarreloj', text: 'Tienes 2 minutos y 15 preguntas. Un error termina la carrera: piensa rápido.', style: 'bg-sky-50 text-sky-600' },
                                        { icon: Swords, title: 'Duelo', text: 'Responde 10 preguntas, comparte el reto y descubre quién conoce más.', style: 'bg-violet-50 text-violet-600' },
                                    ].map(mode => {
                                        const Icon = mode.icon;
                                        return (
                                            <div key={mode.title} className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mode.style}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <h4 className="mt-3 text-sm font-black text-emerald-950">{mode.title}</h4>
                                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{mode.text}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </TabsContent>

                            <TabsContent value="lugares" className="mt-4">
                                <div className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><MapPinned className="h-5 w-5" /></div>
                                        <div>
                                            <h4 className="font-black text-emerald-950">El mundo cabe en una pregunta</h4>
                                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                Elige una partida mundial o pon a prueba lo que sabes de Cali, el Valle del Cauca y Colombia. También puedes jugar con palabras y expresiones del vocabulario caleño.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"><Sparkles className="h-3.5 w-3.5" /> Mundo</span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-xs font-bold text-sky-800"><MapPinned className="h-3.5 w-3.5" /> Colombia y Cali</span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800"><MapPinned className="h-3.5 w-3.5" /> Valle del Cauca</span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-800"><Lightbulb className="h-3.5 w-3.5" /> Vocabulario caleño</span>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex flex-col gap-3 border-t border-emerald-950/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold text-emerald-950">
                                No necesitas saberlo todo: la curiosidad también suma.
                            </p>
                            <Button
                                onClick={handlePlay}
                                className="h-11 shrink-0 rounded-xl bg-primary px-6 font-black text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                            >
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Listo, quiero jugar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border shadow-2xl p-0 overflow-hidden rounded-3xl">
                
                {/* Header Banner */}
                <div className="relative h-32 bg-primary/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    {game.cover_image_url ? (
                        <div className="absolute inset-0">
                            <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background" />
                    )}
                    
                    <div className="relative z-10 w-20 h-20 bg-background rounded-full shadow-xl flex items-center justify-center border-4 border-background">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <div className="p-6 pt-4">
                    <DialogHeader className="text-center mb-6">
                        <DialogTitle className="text-2xl font-bold">{game.title}</DialogTitle>
                        <DialogDescription className="text-base mt-2">
                            {game.description || "Prepárate para poner a prueba tus conocimientos en este desafío cultural."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Mechanic Card */}
                    <div className={`p-4 rounded-2xl border ${mechanicBorder} ${mechanicBg} flex items-start gap-4 mb-4`}>
                        <div className="bg-background rounded-full p-2 shadow-sm shrink-0">
                            {mechanicIcon}
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground mb-1">{mechanicTitle}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{mechanicDesc}</p>
                        </div>
                    </div>

                    {/* Game-specific rules */}
                    {game.instructions && (
                        <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Regla Especial
                            </h4>
                            <p className="text-sm">{game.instructions}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium p-3 bg-muted/50 rounded-xl">
                            <Clock className="w-4 h-4 text-primary" /> Contrarreloj
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm font-medium p-3 bg-muted/50 rounded-xl">
                            <Flame className="w-4 h-4 text-orange-500" /> Racha de Puntos
                        </div>
                    </div>

                    <Button 
                        onClick={onPlay ? handlePlay : () => onOpenChange(false)}
                        className="w-full h-12 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    >
                        ¡Entendido, a jugar!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameInstructionsDialog;
