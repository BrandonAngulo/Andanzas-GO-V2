import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Activity, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export const JuegosAnalyticsPanel = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalSessions: 0,
        completedSessions: 0,
        abandonRate: 0,
        topFailed: [] as { text: string, fails: number }[],
        reports: [] as { id: string, text: string, reason: string, date: string, status: string }[]
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

            setMetrics({
                totalSessions: total,
                completedSessions: completed,
                abandonRate: abandon,
                topFailed,
                reports
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
