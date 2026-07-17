import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { CalendarClock, Coins, Save, Settings } from 'lucide-react';
import { settingsService, AppSetting } from '../../../services/settings.service';
import { toast } from 'sonner';

const ROUTE_NOTICE_KEY = 'custom_route_min_notice_days';
const DEFAULT_ROUTE_NOTICE = 7;
const ROUTE_STOP_POINTS_KEY = 'route_stop_points';
const ROUTE_COMPLETION_MULTIPLIER_KEY = 'route_completion_multiplier';
const DEFAULT_ROUTE_STOP_POINTS = 10;
const DEFAULT_ROUTE_COMPLETION_MULTIPLIER = 1.5;

export const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<AppSetting[]>([]);
    const [routeNoticeDays, setRouteNoticeDays] = useState(DEFAULT_ROUTE_NOTICE);
    const [routeStopPoints, setRouteStopPoints] = useState(DEFAULT_ROUTE_STOP_POINTS);
    const [routeCompletionMultiplier, setRouteCompletionMultiplier] = useState(DEFAULT_ROUTE_COMPLETION_MULTIPLIER);
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        void Promise.all([
            settingsService.getAllSettings(),
            settingsService.getOperationalSetting(ROUTE_NOTICE_KEY, DEFAULT_ROUTE_NOTICE),
            settingsService.getOperationalSetting(ROUTE_STOP_POINTS_KEY, DEFAULT_ROUTE_STOP_POINTS),
            settingsService.getOperationalSetting(ROUTE_COMPLETION_MULTIPLIER_KEY, DEFAULT_ROUTE_COMPLETION_MULTIPLIER),
        ]).then(([flags, noticeDays, stopPoints, completionMultiplier]) => {
            if (!active) return;
            setSettings(flags);
            setRouteNoticeDays(Math.max(1, Math.round(noticeDays)));
            setRouteStopPoints(Math.max(0, Math.round(stopPoints)));
            setRouteCompletionMultiplier(Math.max(1, completionMultiplier));
            setLoading(false);
        });
        return () => { active = false; };
    }, []);

    const handleToggle = async (key: string, currentValue: string) => {
        const newValue = currentValue === 'true' ? 'false' : 'true';
        setSavingKey(key);
        const saved = await settingsService.updateSetting(key, newValue);
        if (saved) {
            setSettings(previous => previous.map(setting => setting.key === key ? { ...setting, value: newValue } : setting));
            toast.success('Función actualizada');
        } else {
            toast.error('No fue posible actualizar la función');
        }
        setSavingKey(null);
    };

    const saveRouteRewards = async () => {
        const normalizedPoints = Math.max(0, Math.min(100, Math.round(routeStopPoints)));
        const normalizedMultiplier = Math.max(1, Math.min(3, Math.round(routeCompletionMultiplier * 100) / 100));
        setRouteStopPoints(normalizedPoints);
        setRouteCompletionMultiplier(normalizedMultiplier);
        setSavingKey(ROUTE_STOP_POINTS_KEY);
        const results = await Promise.all([
            settingsService.updateOperationalSetting(ROUTE_STOP_POINTS_KEY, normalizedPoints),
            settingsService.updateOperationalSetting(ROUTE_COMPLETION_MULTIPLIER_KEY, normalizedMultiplier),
        ]);
        const saved = results.every(Boolean);
        toast[saved ? 'success' : 'error'](saved ? 'Recompensas de rutas actualizadas' : 'No fue posible guardar todas las recompensas');
        setSavingKey(null);
    };

    const saveRouteNotice = async () => {
        const normalized = Math.max(1, Math.min(365, Math.round(routeNoticeDays)));
        setRouteNoticeDays(normalized);
        setSavingKey(ROUTE_NOTICE_KEY);
        const saved = await settingsService.updateOperationalSetting(ROUTE_NOTICE_KEY, normalized);
        toast[saved ? 'success' : 'error'](saved ? 'Anticipación de rutas actualizada' : 'No fue posible guardar la anticipación');
        setSavingKey(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Settings className="w-6 h-6" /></div>
                <div><h2 className="text-2xl font-bold tracking-tight">Ajustes de la aplicación</h2><p className="text-muted-foreground">Configura funciones y reglas operativas sin modificar el código.</p></div>
            </div>

            <Card>
                <CardHeader><CardTitle>Funciones disponibles</CardTitle><CardDescription>Interruptores generales visibles para las personas usuarias.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {loading ? <div className="text-center p-4 text-muted-foreground">Cargando ajustes…</div> : settings.length === 0 ? <div className="text-center p-4 text-muted-foreground border-2 border-dashed rounded-xl">No hay funciones configuradas.</div> : settings.map(setting => (
                        <div key={setting.key} className="flex items-center justify-between gap-4 p-4 border rounded-xl hover:bg-muted/10 transition-colors">
                            <div className="space-y-0.5"><h4 className="font-medium text-sm">{setting.key === 'enable_custom_route_requests' ? 'Solicitudes de rutas personalizadas' : setting.key}</h4><p className="text-sm text-muted-foreground">{setting.description || 'Sin descripción'}</p></div>
                            <Switch checked={setting.value === 'true'} onChange={() => void handleToggle(setting.key, setting.value)} disabled={savingKey !== null} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><CalendarClock className="w-5 h-5 text-primary" />Operación de rutas</CardTitle><CardDescription>Este valor controla tanto el formulario público como la validación de solicitudes en la base de datos.</CardDescription></CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end p-4 border rounded-xl mb-4">
                        <div><p className="font-medium text-sm">Anticipación mínima</p><p className="text-sm text-muted-foreground">Días que deben existir entre la solicitud y la fecha propuesta.</p></div>
                        <label className="text-xs font-medium">Días<Input className="mt-1" type="number" min={1} max={365} value={routeNoticeDays} onChange={event => setRouteNoticeDays(Number(event.target.value))} /></label>
                        <Button onClick={() => void saveRouteNotice()} disabled={savingKey !== null || !Number.isFinite(routeNoticeDays)}><Save className="w-4 h-4 mr-2" />Guardar</Button>
                    </div>
                    <div className="grid gap-4 p-4 border rounded-xl sm:grid-cols-[1fr_150px_150px_auto] sm:items-end">
                        <div><p className="font-medium text-sm flex items-center gap-2"><Coins className="w-4 h-4 text-primary" />Recompensas de recorrido</p><p className="text-sm text-muted-foreground">Entrega puntos al registrar cada parada. Al finalizar, añade solo el porcentaje adicional del multiplicador sobre los puntos obtenidos en esa ruta.</p></div>
                        <label className="text-xs font-medium">Puntos por parada<Input className="mt-1" type="number" min={0} max={100} step={1} value={routeStopPoints} onChange={event => setRouteStopPoints(Number(event.target.value))} /></label>
                        <label className="text-xs font-medium">Multiplicador final<Input className="mt-1" type="number" min={1} max={3} step={0.05} value={routeCompletionMultiplier} onChange={event => setRouteCompletionMultiplier(Number(event.target.value))} /></label>
                        <Button onClick={() => void saveRouteRewards()} disabled={savingKey !== null || !Number.isFinite(routeStopPoints) || !Number.isFinite(routeCompletionMultiplier)}><Save className="w-4 h-4 mr-2" />Guardar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
