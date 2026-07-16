import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Heart, Flag, Flame, Skull, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import { Game } from '../../services/games.service';

interface GameInstructionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game: Game;
}

const GameInstructionsDialog: React.FC<GameInstructionsDialogProps> = ({ open, onOpenChange, game }) => {
    
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
                        onClick={() => onOpenChange(false)}
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
