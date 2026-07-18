import React from 'react';
import { CalendarDays, Clock, Info, PlayCircle, Star, Trophy } from 'lucide-react';
import { Game } from '../../services/games.service';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { LazyImage } from '../ui/lazy-image';

interface GamePresentationCardProps {
    game: Game;
    imageSrc: string;
    title: string;
    description: string;
    onInstructions: () => void;
    onPlay: () => void;
}

export const GamePresentationCard: React.FC<GamePresentationCardProps> = ({
    game,
    imageSrc,
    title,
    description,
    onInstructions,
    onPlay,
}) => {
    const isUpcoming = game.status === 'coming_soon' || game.status === 'scheduled';
    const difficulty = game.difficulty_level === 'easy'
        ? 'Fácil'
        : game.difficulty_level === 'medium'
            ? 'Media'
            : 'Difícil';

    return (
        <Card className="group relative isolate aspect-[8/9] min-h-[31rem] w-full max-w-[28rem] justify-self-center overflow-hidden rounded-[1.6rem] border border-emerald-950/10 bg-emerald-950 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
            <LazyImage
                src={imageSrc}
                alt="ANDI piensa frente a una pregunta y tres opciones culturales."
                className="absolute inset-0 h-full w-full bg-emerald-950 [&_img]:object-cover [&_img]:object-center [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.025]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-emerald-950/95" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#062f36] via-[#073f42]/95 to-transparent" />

            {isUpcoming && (
                <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-lg">
                    {game.show_countdown && game.release_at ? (
                        <>
                            <Clock className="h-3.5 w-3.5" />
                            Faltan {Math.max(1, Math.ceil((new Date(game.release_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} días
                        </>
                    ) : (
                        <>
                            <CalendarDays className="h-3.5 w-3.5" />
                            Próximamente
                        </>
                    )}
                </div>
            )}

            <CardContent className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-5 sm:p-6">
                <div>
                    <h3 className="text-2xl font-black uppercase leading-none tracking-tight drop-shadow-md sm:text-3xl">
                        {title}
                    </h3>
                    <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-white/85 line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-white/90">
                    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                        <Star className="h-4 w-4 text-amber-300" />
                        <span>{difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                        <Trophy className="h-4 w-4 text-amber-300" />
                        <span>{game.base_points_reward} puntos</span>
                    </div>
                </div>

                {game.status === 'published' ? (
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            className="h-11 border-white/25 bg-white/95 px-3 font-bold text-emerald-950 shadow-lg hover:bg-white"
                            onClick={onInstructions}
                            title="Cómo jugar"
                            aria-label={`Cómo jugar ${title}`}
                        >
                            <Info className="mr-2 h-4 w-4 text-primary" />
                            Cómo jugar
                        </Button>
                        <Button
                            className="h-11 bg-primary px-3 font-bold text-primary-foreground shadow-lg hover:bg-primary/90"
                            onClick={onPlay}
                            aria-label={`Jugar ${title}`}
                        >
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Jugar
                        </Button>
                    </div>
                ) : (
                    <Button className="h-11 w-full shadow-lg" disabled variant="secondary">
                        En preparación
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
