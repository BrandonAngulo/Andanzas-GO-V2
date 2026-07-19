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
    PlayCircle,
    ShieldAlert,
    Skull,
    Trophy,
} from 'lucide-react';
import { Game } from '../../services/games.service';

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
    const isTriviaGo =
        game.id === '81111111-1111-1111-1111-111111111111'
        || game.slug?.toLowerCase() === 'trivia-cali'
        || game.title?.toLowerCase() === 'trivia cali';
    
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

    if (isTriviaGo) {
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
                description: 'Cada respuesta abre una historia de la ciudad.',
                color: 'text-amber-600',
                surface: 'bg-amber-50',
            },
            {
                icon: Trophy,
                title: 'Suma y avanza',
                description: 'Gana puntos y construye tu recorrido con Andi.',
                color: 'text-violet-600',
                surface: 'bg-violet-50',
            },
        ];

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[2rem] border-emerald-950/10 bg-[#fbfaf6] p-0 shadow-2xl sm:max-w-2xl">
                    <div className="relative min-h-[11.5rem] overflow-hidden bg-gradient-to-br from-[#063b42] via-[#086052] to-[#10a866] px-6 py-6 text-white sm:px-8">
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
                                Responde, aprende algo inesperado y sigue explorando la ciudad.
                            </DialogDescription>
                        </DialogHeader>
                        <img
                            src="/brand/andi/andi-frontal-512.png"
                            alt="Andi presenta las instrucciones de TRIVIA GO."
                            className="absolute -bottom-5 right-2 h-[11rem] w-auto object-contain drop-shadow-2xl sm:right-7 sm:h-[12rem]"
                            loading="eager"
                            decoding="async"
                        />
                    </div>

                    <div className="space-y-4 p-5 sm:p-6">
                        <div className="grid gap-3 sm:grid-cols-3">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.title}
                                        className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 sm:block">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.surface}`}>
                                                <Icon className={`h-5 w-5 ${step.color}`} />
                                            </div>
                                            <div className="sm:mt-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    Paso {index + 1}
                                                </p>
                                                <h4 className="mt-0.5 text-sm font-black text-emerald-950">
                                                    {step.title}
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${mechanicBorder} ${mechanicBg}`}>
                            <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm">
                                {mechanicIcon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Regla de esta partida
                                </p>
                                <h4 className="mt-0.5 font-black text-foreground">{mechanicTitle}</h4>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{mechanicDesc}</p>
                            </div>
                        </div>

                        {game.instructions && (
                            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
                                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <h4 className="text-sm font-black text-foreground">Tenlo en cuenta</h4>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {game.instructions}
                                    </p>
                                </div>
                            </div>
                        )}

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
