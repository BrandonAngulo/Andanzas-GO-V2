import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { supabase } from '../../../lib/supabaseClient';
import { BarChart, Activity, Users, MousePointerClick, CalendarDays } from 'lucide-react';

interface MetricsSummary {
    totalSessions: number;
    totalEvents: number;
    activeUsersToday: number;
    topEvents: { name: string; count: number }[];
}

export const AdminMetricas: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<MetricsSummary>({
        totalSessions: 0,
        totalEvents: 0,
        activeUsersToday: 0,
        topEvents: []
    });

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        setLoading(true);
        try {
            // Get total sessions
            const { count: sessionsCount } = await supabase
                .from('user_sessions')
                .select('*', { count: 'exact', head: true });

            // Get total events
            const { count: eventsCount } = await supabase
                .from('analytics_events')
                .select('*', { count: 'exact', head: true });

            // Get active users today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const { count: activeUsers } = await supabase
                .from('user_sessions')
                .select('user_id', { count: 'exact', head: true })
                .gte('started_at', today.toISOString())
                .not('user_id', 'is', null);

            // Get top events
            const { data: eventsData } = await supabase
                .from('analytics_events')
                .select('event_name');

            const eventCounts: Record<string, number> = {};
            if (eventsData) {
                eventsData.forEach(e => {
                    eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
                });
            }
            
            const topEventsList = Object.entries(eventCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setMetrics({
                totalSessions: sessionsCount || 0,
                totalEvents: eventsCount || 0,
                activeUsersToday: activeUsers || 0,
                topEvents: topEventsList
            });
        } catch (error) {
            console.error("Error loading metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="py-20 text-center text-muted-foreground animate-pulse">Cargando métricas...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-primary" />
                    Gestión y Actividad
                </h3>
                <p className="text-muted-foreground text-sm">Resumen de la interacción de los usuarios en la plataforma.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Sesiones Totales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">{metrics.totalSessions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4" /> Eventos Registrados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{metrics.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="w-4 h-4" /> Usuarios Activos Hoy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{metrics.activeUsersToday}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Eventos más frecuentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {metrics.topEvents.length > 0 ? (
                        <div className="space-y-4">
                            {metrics.topEvents.map((ev, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="font-medium">{ev.name}</div>
                                    <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                                        {ev.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            Aún no hay eventos registrados en la base de datos.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
