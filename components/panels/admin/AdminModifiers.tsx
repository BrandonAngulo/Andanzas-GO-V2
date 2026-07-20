import React, { useEffect, useState } from 'react';
import { modifierService, GameModifier } from '../../../services/modifier.service';
import { Button } from '../../ui/button';
import { Flame, Check, Power, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Control de admin de los modificadores controlados: activar UNA versión a la vez.
export const AdminModifiers: React.FC = () => {
    const [mods, setMods] = useState<GameModifier[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);

    const load = async () => { setMods(await modifierService.list()); setLoading(false); };
    useEffect(() => { load(); }, []);

    const activeKey = mods.find(m => m.is_active)?.key || null;

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

    if (loading) return <div className="py-6 text-center text-sm text-muted-foreground">Cargando modificadores…</div>;

    return (
        <div className="mb-6 rounded-2xl border border-border/70 bg-card p-4">
            <div className="mb-1 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold">Modificador de la semana</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">Activá una versión (una a la vez). Cambia las reglas del juego para todos hasta que la apagues.</p>
            <div className="grid gap-2 sm:grid-cols-2">
                {mods.map(m => {
                    const isActive = m.key === activeKey;
                    return (
                        <div key={m.key} className={`rounded-xl border p-3 ${isActive ? 'border-amber-500 bg-amber-500/10' : 'border-border bg-muted/30'}`}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 text-sm font-bold">{m.label}{isActive && <Check className="h-4 w-4 text-amber-600" />}</div>
                                    <div className="text-xs text-muted-foreground">{m.description}</div>
                                </div>
                                <Button size="sm" variant={isActive ? 'secondary' : 'default'} disabled={busy === m.key || isActive} onClick={() => activate(m.key)} className="shrink-0 rounded-full text-xs">
                                    {busy === m.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isActive ? 'Activo' : 'Activar'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {activeKey && (
                <Button variant="outline" size="sm" disabled={busy === '__clear'} onClick={clear} className="mt-3 rounded-full">
                    <Power className="mr-1.5 h-3.5 w-3.5" /> Apagar modificador
                </Button>
            )}
        </div>
    );
};
