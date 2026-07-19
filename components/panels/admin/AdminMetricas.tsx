import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { supabase } from '../../../lib/supabaseClient';
import { Activity, Users, MousePointerClick, CalendarDays, Gamepad2, Gauge, Coins, Gem, Heart, Sparkles, FileWarning, ShoppingBag, RefreshCcw, Map, ClipboardCheck } from 'lucide-react';
import { Button } from '../../ui/button';

interface ManagementMetrics {
    users: { total: number; suspended: number; active_today: number; active_7d: number; average_level: number; average_xp: number };
    activity: { sessions: number; events: number; events_7d: number; top_events: { name: string; count: number }[] };
    games: { sessions: number; completed: number; active: number; average_accuracy: number; questions_published: number; questions_review: number; questions_draft: number; reports_open: number };
    routes: { total: number; active_progress: number; completed_progress: number; confirmed_registrations: number; waitlist_registrations: number; custom_requests_open: number };
    economy: { points_in_wallets: number; coins_in_wallets: number; gems_in_wallets: number; available_lives: number; transactions_30d: number; shop_purchases_30d: number; gems_awarded_30d: number; coins_awarded_30d: number };
}

const EMPTY: ManagementMetrics = {
    users: { total: 0, suspended: 0, active_today: 0, active_7d: 0, average_level: 0, average_xp: 0 },
    activity: { sessions: 0, events: 0, events_7d: 0, top_events: [] },
    games: { sessions: 0, completed: 0, active: 0, average_accuracy: 0, questions_published: 0, questions_review: 0, questions_draft: 0, reports_open: 0 },
    routes: { total: 0, active_progress: 0, completed_progress: 0, confirmed_registrations: 0, waitlist_registrations: 0, custom_requests_open: 0 },
    economy: { points_in_wallets: 0, coins_in_wallets: 0, gems_in_wallets: 0, available_lives: 0, transactions_30d: 0, shop_purchases_30d: 0, gems_awarded_30d: 0, coins_awarded_30d: 0 }
};

// Etiquetas legibles para los nombres crudos de eventos (analytics_events.event_name).
const EVENT_LABELS: Record<string, string> = {
    panel_view: 'Vistas de panel',
    session_start: 'Inicios de sesión',
    game_mode_viewed: 'Juegos abiertos',
    game_started: 'Partidas iniciadas',
    question_answered: 'Preguntas respondidas',
    game_completed: 'Partidas completadas',
    game_abandoned: 'Partidas abandonadas',
    reward_granted: 'Recompensas otorgadas',
    resource_spent: 'Recursos gastados',
    challenge_created: 'Duelos creados',
    challenge_accepted: 'Duelos aceptados',
    challenge_completed: 'Duelos completados',
    daily_question_viewed: 'Pregunta del día vista',
    daily_question_answered: 'Pregunta del día respondida',
    daily_question_shared: 'Pregunta del día compartida',
};
const eventLabel = (name: string) => EVENT_LABELS[name] || name;

function MetricCard({ title, value, detail, icon: Icon, tone = 'default' }: { title: string; value: number | string; detail: string; icon: React.ElementType; tone?: 'default' | 'warning' | 'success' }) {
    const toneClass = tone === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : tone === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-muted/30';
    return <Card className={toneClass}><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-muted-foreground">{title}</p><p className="text-2xl font-black mt-1">{value}</p><p className="text-[11px] text-muted-foreground mt-1">{detail}</p></div><Icon className="w-5 h-5 text-primary" /></div></CardContent></Card>;
}

export const AdminMetricas: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<ManagementMetrics>(EMPTY);

    const loadMetrics = async () => {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_admin_management_metrics');
        if (error) console.error('Error loading management metrics:', error);
        else if (data) setMetrics(data as ManagementMetrics);
        setLoading(false);
    };

    useEffect(() => { loadMetrics(); }, []);

    if (loading) return <div className="py-20 text-center text-muted-foreground animate-pulse">Actualizando indicadores de gestión…</div>;
    const completionRate = metrics.games.sessions ? Math.round((metrics.games.completed / metrics.games.sessions) * 100) : 0;

    return <div className="space-y-8">
        <div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-bold flex items-center gap-2"><Gauge className="w-5 h-5 text-primary" />Indicadores de gestión</h3><p className="text-sm text-muted-foreground">Uso, calidad editorial, progresión y economía en una sola lectura.</p></div><Button variant="outline" size="sm" onClick={loadMetrics}><RefreshCcw className="w-4 h-4 mr-2" />Actualizar</Button></div>

        <section className="space-y-3"><h4 className="font-semibold text-sm flex items-center gap-2"><Users className="w-4 h-4" />Usuarios y uso</h4><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title="Usuarios" value={metrics.users.total} detail={`${metrics.users.suspended} suspendidos`} icon={Users} />
            <MetricCard title="Activos hoy" value={metrics.users.active_today} detail={`${metrics.users.active_7d} en los últimos 7 días`} icon={CalendarDays} />
            <MetricCard title="Sesiones de navegación" value={metrics.activity.sessions} detail={`${metrics.activity.events_7d} eventos esta semana`} icon={Activity} />
            <MetricCard title="Progresión promedio" value={`Nivel ${metrics.users.average_level}`} detail={`${metrics.users.average_xp} XP promedio`} icon={Sparkles} />
        </div></section>

        <section className="space-y-3"><h4 className="font-semibold text-sm flex items-center gap-2"><Map className="w-4 h-4" />Rutas, avance e inscripciones</h4><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title="Rutas disponibles" value={metrics.routes.total} detail="Rutas registradas en el sistema" icon={Map} />
            <MetricCard title="Recorridos activos" value={metrics.routes.active_progress} detail={`${metrics.routes.completed_progress} completados`} icon={Activity} />
            <MetricCard title="Inscripciones confirmadas" value={metrics.routes.confirmed_registrations} detail={`${metrics.routes.waitlist_registrations} en lista de espera`} icon={ClipboardCheck} tone="success" />
            <MetricCard title="Solicitudes personalizadas" value={metrics.routes.custom_requests_open} detail="Pendientes o en gestión" icon={FileWarning} tone={metrics.routes.custom_requests_open ? 'warning' : 'default'} />
        </div></section>

        <section className="space-y-3"><h4 className="font-semibold text-sm flex items-center gap-2"><Gamepad2 className="w-4 h-4" />Juegos y calidad editorial</h4><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title="Partidas" value={metrics.games.sessions} detail={`${completionRate}% completadas`} icon={Gamepad2} />
            <MetricCard title="Precisión promedio" value={`${metrics.games.average_accuracy}%`} detail={`${metrics.games.active} partidas activas`} icon={Gauge} />
            <MetricCard title="Preguntas publicadas" value={metrics.games.questions_published} detail={`${metrics.games.questions_draft} borradores`} icon={MousePointerClick} tone="success" />
            <MetricCard title="Revisión editorial" value={metrics.games.questions_review} detail={`${metrics.games.reports_open} reportes abiertos`} icon={FileWarning} tone={metrics.games.questions_review ? 'warning' : 'default'} />
        </div></section>

        <section className="space-y-3"><h4 className="font-semibold text-sm flex items-center gap-2"><Coins className="w-4 h-4" />Economía y recompensas</h4><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title="Puntos Andanzas" value={metrics.economy.points_in_wallets} detail="Saldo total de usuarios" icon={Sparkles} />
            <MetricCard title="Monedas" value={metrics.economy.coins_in_wallets} detail={`${metrics.economy.coins_awarded_30d} entregadas en 30 días`} icon={Coins} />
            <MetricCard title="Gemas" value={metrics.economy.gems_in_wallets} detail={`${metrics.economy.gems_awarded_30d} entregadas en 30 días`} icon={Gem} />
            <MetricCard title="Vidas disponibles" value={metrics.economy.available_lives} detail={`${metrics.economy.shop_purchases_30d} compras en 30 días`} icon={Heart} />
        </div></section>

        <div className="grid lg:grid-cols-2 gap-4"><Card><CardHeader><CardTitle className="text-base">Eventos más frecuentes</CardTitle></CardHeader><CardContent className="space-y-2">{metrics.activity.top_events.length ? metrics.activity.top_events.map(ev => <div key={ev.name} className="flex justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"><span title={ev.name}>{eventLabel(ev.name)}</span><strong>{ev.count}</strong></div>) : <p className="text-sm text-muted-foreground">Todavía no hay eventos registrados.</p>}</CardContent></Card><Card><CardHeader><CardTitle className="text-base">Movimiento económico</CardTitle></CardHeader><CardContent><div className="flex items-center gap-3"><ShoppingBag className="w-8 h-8 text-primary" /><div><p className="text-2xl font-black">{metrics.economy.transactions_30d}</p><p className="text-xs text-muted-foreground">movimientos auditados en los últimos 30 días</p></div></div></CardContent></Card></div>
    </div>;
};
