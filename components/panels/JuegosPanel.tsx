import React, { useEffect, useState } from 'react';
import { Game, gamesService } from '../../services/games.service';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Gamepad2, Clock, Trophy, PlayCircle, Star, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LeaderboardPanel } from './LeaderboardPanel';

interface JuegosPanelProps {
    onPlayGame: (gameId: string) => void;
}

export const JuegosPanel: React.FC<JuegosPanelProps> = ({ onPlayGame }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        setLoading(true);
        // We fetch all games, then filter by public statuses
        const data = await gamesService.getAllGames();
        const publicGames = data.filter(g => g.status === 'published' || g.status === 'coming_soon');
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
        <div className="space-y-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Zona Play</h2>
                    <p className="text-muted-foreground">Demuestra cuánto sabés, reta amigos y gana puntos para tu perfil.</p>
                </div>
            </div>

            <Tabs defaultValue="juegos" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="juegos">Trivias y Retos</TabsTrigger>
                    <TabsTrigger value="podio">Salón de la Fama</TabsTrigger>
                </TabsList>
                
                <TabsContent value="juegos" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                    <Card key={game.id} className="overflow-hidden border border-border/50 hover:shadow-lg transition-all hover:-translate-y-1 bg-card/60 backdrop-blur-sm group">
                        <div className="h-32 bg-primary/10 relative flex items-center justify-center p-6">
                            {game.status === 'coming_soon' && (
                                <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
                                    <CalendarDays className="w-3 h-3" />
                                    Próximamente
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-xl font-black text-primary drop-shadow-sm line-clamp-2">
                                    {game.cover_title || game.title}
                                </h3>
                                {(game.cover_subtitle || game.status === 'coming_soon') && (
                                    <p className="text-sm font-medium text-foreground/80 mt-1">
                                        {game.cover_subtitle || 'En preparación...'}
                                    </p>
                                )}
                            </div>
                        </div>
                        <CardContent className="p-5 flex flex-col h-[200px]">
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                {game.description || 'Pon a prueba tus conocimientos en este desafío especial.'}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4 font-medium">
                                <div className="flex items-center gap-1.5 bg-muted/50 p-2 rounded-lg">
                                    <Star className="w-4 h-4 text-primary" />
                                    <span>{game.difficulty_level === 'easy' ? 'Fácil' : game.difficulty_level === 'medium' ? 'Media' : 'Difícil'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/50 p-2 rounded-lg">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span>{game.base_points_reward} Puntos</span>
                                </div>
                            </div>
                            
                            <Button 
                                className="w-full shadow-md hover:shadow-lg transition-shadow group-hover:bg-primary/90"
                                disabled={game.status !== 'published'}
                                variant={game.status === 'published' ? 'default' : 'secondary'}
                                onClick={() => game.status === 'published' && onPlayGame(game.id)}
                            >
                                {game.status === 'published' ? (
                                    <>
                                        <PlayCircle className="w-5 h-5 mr-2" />
                                        Jugar Ahora
                                    </>
                                ) : (
                                    <>En Preparación</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                    </div>
                </TabsContent>
                
                <TabsContent value="podio">
                    <LeaderboardPanel />
                </TabsContent>
            </Tabs>
        </div>
    );
};
