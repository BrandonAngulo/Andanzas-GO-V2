import React, { useEffect, useState } from 'react';
import { gamificationService } from '../../services/gamification.service';
import { Card, CardContent } from '../ui/card';
import { Trophy, Medal, Star, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserAvatar } from '../shared/UserAvatar';

export const LeaderboardPanel: React.FC = () => {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            setLoading(true);
            const data = await gamificationService.getGlobalLeaderboard(10);
            setLeaders(data);
            setLoading(false);
        };
        fetchLeaders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20 text-muted-foreground animate-pulse">
                Cargando el salón de la fama...
            </div>
        );
    }

    if (leaders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">Aún no hay leyendas</h3>
                <p className="text-muted-foreground max-w-md">
                    El podio está vacío. ¡Empieza a jugar trivias para ser el primero!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" /> 
                    Salón de la Fama
                </h2>
                <p className="text-muted-foreground">Los mejores exploradores y conocedores de Andanzas.</p>
            </div>

            <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-0">
                    {leaders.map((leader, index) => {
                        let rankIcon = null;
                        let rankClass = "text-muted-foreground font-bold";
                        let bgClass = "hover:bg-muted/30";

                        if (index === 0) {
                            rankIcon = <Trophy className="w-6 h-6 text-yellow-500" />;
                            rankClass = "text-yellow-500 font-black";
                            bgClass = "bg-yellow-500/5 hover:bg-yellow-500/10";
                        } else if (index === 1) {
                            rankIcon = <Medal className="w-6 h-6 text-slate-400" />;
                            rankClass = "text-slate-400 font-bold";
                            bgClass = "bg-slate-500/5 hover:bg-slate-500/10";
                        } else if (index === 2) {
                            rankIcon = <Medal className="w-6 h-6 text-amber-600" />;
                            rankClass = "text-amber-600 font-bold";
                            bgClass = "bg-amber-600/5 hover:bg-amber-600/10";
                        }

                        return (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={leader.id} 
                                className={`flex items-center gap-4 p-4 border-b border-border/50 transition-colors last:border-b-0 ${bgClass}`}
                            >
                                <div className={`w-8 text-center text-xl flex justify-center ${rankClass}`}>
                                    {rankIcon || (index + 1)}
                                </div>
                                
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                    <UserAvatar userProfile={leader} className="w-full h-full" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground truncate">{leader.full_name || 'Usuario Anónimo'}</h4>
                                </div>

                                <div className="flex items-center gap-1.5 bg-background p-2 rounded-xl shadow-sm border border-border/50">
                                    <Star className="w-4 h-4 text-primary" />
                                    <span className="font-bold">{leader.total_points || 0}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};
