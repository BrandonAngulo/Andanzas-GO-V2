import React, { useEffect, useState } from 'react';
import { modifierService, GameModifier, ModifierRotation } from '../../../services/modifier.service';
import { Button } from '../../ui/button';
import { Check, Power, Loader2, Repeat } from 'lucide-react';
import { toast } from 'sonner';

// Control de admin de los modificadores controlados: activar UNA versión a la vez (manual),
// o encender la ROTACIÓN AUTOMÁTICA (todos se turnan solos, en bucle, sin cruzarse).
export const AdminModifiers: React.FC = () => {
    const [mods, setMods] = useState<GameModifier[]>([]);
    const [rotation, setRotation] = useState<ModifierRotation | null>(null);
    const [active, setActive] = useState<GameModifier | null>(null);
    const [period, setPeriod] = useState(7);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);
    const [savingRot, setSavingRot] = useState(false);

    const load = async () => {
        const [list, rot, act] = await Promise.all([
            modifierService.list(), modifierService.getRotation(), modifierService.getActive(),
        ]);
        setMods(list); setRotation(rot); setActive(act); setPeriod(rot.period_days || 7); setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const rotating = !!rotation?.enabled;
    const activeKey = active?.key || null;

    const activate = async (key: string) => {
        setBusy(key);
        try { await modifierService.setActive(key); toast.success('Modificador activado para todos.'); await load(); }
        catch (e: any) { toast.error(String(e?.message || '').includes('NOT_AUTHORIZED') ? 'No autorizado.' : 'No se pudo activar.'); }
        finally { setBusy(null); }
    };
    const clear = async () => {
        setBusy('__clear');
        try { await modifierService.clearActive(); toast.success('Modificador apagado (reglas normales).'); await load(); }
        catch { toast.error('No se pudo apagar.'); }
        finally { setBusy(null); }
    };
    const toggleRotation = async () => {
        setSavingRot(true);
        try {
            await modifierService.setRotation(!rotating, period);
            toast.success(!rotating ? `Rotación automática activada (cada ${period} día${period === 1 ? '' : 's'}).` : 'Rotación automática apagada.');
            await load();
        } catch (e: any) {
            toast.error(String(e?.message || '').includes('NOT_AUTHORIZED') ? 'No autorizado.' : 'No se pudo cambiar la rotación.');
        } finally { setSavingRot(false); }
    };
    const savePeriod = async () => {
        setSavingRot(true);
        try { await modifierService.setRotation(true, period); toast.success('Período actualizado.'); await load(); }
        catch { toast.error('No se pudo guardar el período.'); }
        finally { setSavingRot(false); }
    };

    if (loading) return <div className="py-6 text-center text-sm text-muted-foreground">Cargando modificadores…</div>;

    return (
        <div className="mb-6 rounded-2xl border border-border/70 bg-card p-4">
            <div className="mb-1 flex items-center gap-2">
                <Repeat className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Modificador de la semana</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">Activá una versión a mano, o encendé la rotación automática para que se turnen solos.</p>

            {/* Rotación automática */}
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-sm font-bold"><Repeat className="h-4 w-4 text-primary" /> Rotación automática</div>
                        <p className="text-xs text-muted-foreground">Todos los modificadores se turnan solos, uno a la vez, en bucle.</p>
                    </div>
                    <Button size="sm" variant={rotating ? 'default' : 'outline'} disabled={savingRot} onClick={toggleRotation} className="shrink-0 rounded-full">
                        {savingRot ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : rotating ? 'Activada' : 'Activar'}
                    </Button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Cada</span>
                    <input
                        type="number" min={1} value={period}
                        onChange={e => setPeriod(Math.max(1, Number(e.target.value) || 1))}
                        className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm"
                    />
                    <span className="text-muted-foreground">día(s)</span>
                    {rotating && <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={savePeriod} disabled={savingRot}>Guardar período</Button>}
                </div>
                {rotating && active && <p className="mt-2 text-xs font-semibold text-primary">Rotando ahora: {active.label}</p>}
            </div>

            {/* Activación manual (deshabilitada mientras la rotación esté encendida) */}
            <div className={`grid gap-2 sm:grid-cols-2 ${rotating ? 'opacity-50' : ''}`}>
                {mods.map(m => {
                    const isActive = !rotating && m.key === activeKey;
                    return (
                        <div key={m.key} className={`rounded-xl border p-3 ${isActive ? 'border-amber-500 bg-amber-500/10' : 'border-border bg-muted/30'}`}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 text-sm font-bold">{m.label}{isActive && <Check className="h-4 w-4 text-amber-600" />}</div>
                                    <div className="text-xs text-muted-foreground">{m.description}</div>
                                </div>
                                <Button size="sm" variant={isActive ? 'secondary' : 'default'} disabled={busy === m.key || isActive || rotating} onClick={() => activate(m.key)} className="shrink-0 rounded-full text-xs">
                                    {busy === m.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isActive ? 'Activo' : 'Activar'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {rotating && <p className="mt-2 text-xs text-muted-foreground">Apagá la rotación para activar uno a mano.</p>}
            {!rotating && activeKey && (
                <Button variant="outline" size="sm" disabled={busy === '__clear'} onClick={clear} className="mt-3 rounded-full">
                    <Power className="mr-1.5 h-3.5 w-3.5" /> Apagar modificador
                </Button>
            )}
        </div>
    );
};
