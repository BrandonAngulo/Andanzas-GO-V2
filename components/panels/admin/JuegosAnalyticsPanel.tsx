import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Activity, AlertTriangle, XCircle, CheckCircle2, Filter, Layers, Gauge } from 'lucide-react';

export const JuegosAnalyticsPanel = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalSessions: 0,
        completedSessions: 0,
        abandonRate: 0,
        topFailed: [] as { text: string, fails: number }[],
        reports: [] as { id: string, text: string, reason: string, date: string, status: string }[],
        // Instrumentación Fase 0 (desde analytics_events + game_answers)
        funnel: { viewed: 0, started: 0, completed: 0 },
        byMode: [] as { mode: string, started: number, completed: number }[],
        accuracyByLevel: [] as { level: number, correct: number, total: number }[]
    });

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        setLoading(true);
        try {
            // 1. Sessions & Abandonment
            const { data: sessions } = await supabase.from('game_sessions').select('status');
            const total = sessions?.length || 0;
            const completed = sessions?.filter(s => s.status === 'completed').length || 0;
            const abandon = total > 0 ? ((total - completed) / total) * 100 : 0;

            // 2. Failed questions (Simplified: get recent answers and aggregate)
            // In a real prod environment with lots of data, this should be an RPC call.
            const { data: answers } = await supabase
                .from('game_answers')
                .select('is_correct, question_snapshot')
                .eq('is_correct', false)
                .limit(500);

            const failsMap: Record<string, { text: string, count: number }> = {};
            if (answers) {
                answers.forEach(a => {
                    const q = a.question_snapshot;
                    if (q && q.id) {
                        if (!failsMap[q.id]) {
                            failsMap[q.id] = { text: q.question_text || 'Pregunta', count: 0 };
                        }
                        failsMap[q.id].count++;
                    }
                });
            }

            const topFailed = Object.values(failsMap)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map(f => ({ text: f.text, fails: f.count }));

            // 3. Reports
            const { data: reportsData } = await supabase
                .from('question_reports')
                .select('*, game_questions(question_text)')
                .order('created_at', { ascending: false })
                .limit(20);

            const reports = (reportsData || []).map((r: any) => ({
                id: r.id,
                text: r.game_questions?.question_text || 'Pregunta eliminada',
                reason: r.reason,
                date: new Date(r.created_at).toLocaleDateString(),
                status: r.status
            }));

            // 4. Instrumentación Fase 0: embudo y partidas por modo (analytics_events).
            const { data: events } = await supabase
                .from('analytics_events')
                .select('event_name, metadata')
                .in('event_name', ['game_mode_viewed', 'game_started', 'game_completed']);
            const evList = (events || []) as { event_name: string, metadata: any }[];
            const funnel = {
                viewed: evList.filter(e => e.event_name === 'game_mode_viewed').length,
                started: evList.filter(e => e.event_name === 'game_started').length,
                completed: evList.filter(e => e.event_name === 'game_completed').length
            };
            const modeMap: Record<string, { started: number, completed: number }> = {};
            evList.forEach(e => {
                if (e.event_name !== 'game_started' && e.event_name !== 'game_completed') return;
                const mode = (e.metadata?.mode as string) || 'desconocido';
                if (!modeMap[mode]) modeMap[mode] = { started: 0, completed: 0 };
                if (e.event_name === 'game_started') modeMap[mode].started++;
                else modeMap[mode].completed++;
            });
            const byMode = Object.entries(modeMap)
                .map(([mode, v]) => ({ mode, ...v }))
                .sort((a, b) => b.started - a.started);

            // 5. Exactitud por dificultad (game_answers + nivel de la pregunta).
            // A escala esto debería ser un RPC; con los volúmenes actuales basta el cruce en cliente.
            const { data: ans } = await supabase.from('game_answers').select('is_correct, question_id').limit(2000);
            const ansList = (ans || []) as { is_correct: boolean, question_id: string | null }[];
            const qIds = Array.from(new Set(ansList.map(a => a.question_id).filter(Boolean))) as string[];
            const levelMap = new Map<string, number>();
            if (qIds.length > 0) {
                const { data: qs } = await supabase.from('game_questions').select('id, level').in('id', qIds);
                (qs || []).forEach((q: any) => levelMap.set(q.id, Number(q.level || 1)));
            }
            const levelAgg: Record<number, { correct: number, total: number }> = {};
            ansList.forEach(a => {
                if (!a.question_id) return;
                const lvl = levelMap.get(a.question_id) || 1;
                if (!levelAgg[lvl]) levelAgg[lvl] = { correct: 0, total: 0 };
                levelAgg[lvl].total++;
                if (a.is_correct) levelAgg[lvl].correct++;
            });
            const accuracyByLevel = Object.entries(levelAgg)
                .map(([level, v]) => ({ level: Number(level), ...v }))
                .sort((a, b) => a.level - b.level);

            setMetrics({
                totalSessions: total,
                completedSessions: completed,
                abandonRate: abandon,
                topFailed,
                reports,
                funnel,
                byMode,
                accuracyByLevel
            });

        } catch (error) {
            console.error("Error loading metrics", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveReport = async (id: string) => {
        await supabase.from('question_reports').update({ status: 'resolved' }).eq('id', id);
        loadMetrics();
    };

    if (loading) {
        return <div className="text-center py-10 text-muted-foreground">Cargando analíticas...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Analíticas de Juegos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Total Sesiones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.totalSessions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Completadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{metrics.completedSessions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Tasa de Abandono</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">{metrics.abandonRate.toFixed(1)}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Instrumentación Fase 0: embudo, modos y dificultad */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Filter className="w-5 h-5 text-primary" /> Embudo (Fase 0)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {metrics.funnel.viewed + metrics.funnel.started + metrics.funnel.completed === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin eventos aún. Se poblará con el uso tras el despliegue.</p>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between"><span>Vieron modo</span><span className="font-bold">{metrics.funnel.viewed}</span></li>
                                <li className="flex justify-between"><span>Iniciaron</span><span className="font-bold">{metrics.funnel.started}{metrics.funnel.viewed > 0 ? <span className="text-muted-foreground font-normal"> ({Math.round(metrics.funnel.started / metrics.funnel.viewed * 100)}%)</span> : null}</span></li>
                                <li className="flex justify-between"><span>Completaron</span><span className="font-bold">{metrics.funnel.completed}{metrics.funnel.started > 0 ? <span className="text-muted-foreground font-normal"> ({Math.round(metrics.funnel.completed / metrics.funnel.started * 100)}%)</span> : null}</span></li>
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Layers className="w-5 h-5 text-primary" /> Partidas por Modo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {metrics.byMode.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin datos de modo aún.</p>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {metrics.byMode.map(m => (
                                    <li key={m.mode} className="flex justify-between items-center bg-muted/30 p-2 rounded">
                                        <span className="font-medium capitalize">{m.mode}</span>
                                        <span className="text-xs text-muted-foreground">{m.started} inic · {m.completed} compl</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Gauge className="w-5 h-5 text-primary" /> Exactitud por Dificultad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {metrics.accuracyByLevel.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin respuestas registradas.</p>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {metrics.accuracyByLevel.map(l => {
                                    const pct = l.total > 0 ? Math.round(l.correct / l.total * 100) : 0;
                                    return (
                                        <li key={l.level} className="flex justify-between items-center">
                                            <span>Nivel {l.level}</span>
                                            <span className="font-bold">{pct}% <span className="text-xs text-muted-foreground font-normal">({l.correct}/{l.total})</span></span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <XCircle className="w-5 h-5 text-red-500" /> Preguntas Más Falladas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {metrics.topFailed.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay datos suficientes.</p>
                        ) : (
                            <ul className="space-y-4">
                                {metrics.topFailed.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                                        <span className="text-sm font-medium line-clamp-2 pr-4">{item.text}</span>
                                        <span className="text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full whitespace-nowrap">
                                            {item.fails} fallos
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Reportes de Usuarios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {metrics.reports.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay reportes pendientes.</p>
                        ) : (
                            <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {metrics.reports.map((report) => (
                                    <li key={report.id} className={`p-3 rounded-lg border ${report.status === 'resolved' ? 'opacity-60 bg-muted border-transparent' : 'bg-card border-yellow-500/30'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-semibold text-muted-foreground">{report.date}</span>
                                            {report.status === 'pending' ? (
                                                <button onClick={() => handleResolveReport(report.id)} className="text-xs text-primary hover:underline flex items-center">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Marcar resuelto
                                                </button>
                                            ) : (
                                                <span className="text-xs text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Resuelto</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium mb-1 line-clamp-1" title={report.text}>Q: {report.text}</p>
                                        <p className="text-sm text-muted-foreground italic">"{report.reason}"</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
