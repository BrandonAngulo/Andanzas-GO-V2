import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { toast } from 'sonner';
import { Save, Loader2, Edit, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { helpService, HelpEntry, HelpMap } from '../../../services/help.service';

// The help entries that exist in the app, in display order.
const HELP_ITEMS: { key: string; label: string; where: string }[] = [
    { key: 'mapa', label: 'Mapa', where: 'Botón "?" junto al título del mapa' },
    { key: 'perfil', label: 'Perfil', where: 'Botón "?" junto al título del perfil' },
    { key: 'economy', label: 'Puntos y economía', where: 'Diálogo "¿Cómo funcionan los puntos?" en el perfil' },
    { key: 'favoritos', label: 'Favoritos', where: 'Botón "?" junto al título de Favoritos' },
    { key: 'reseñas', label: 'Mis reseñas', where: 'Botón "?" junto al título de Reseñas' },
    { key: 'tendencias', label: 'Tendencias', where: 'Botón "?" junto al título de Tendencias' },
    { key: 'noticias', label: 'Noticias', where: 'Botón "?" junto al título de Noticias' },
    { key: 'diccionario', label: 'Diccionario', where: 'Botón "?" junto al título del Diccionario' },
];

interface EditingHelp extends HelpEntry {
    label: string;
}

export const AdminHelpContent = () => {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<HelpMap>({});
    const [editing, setEditing] = useState<EditingHelp | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        const map = await helpService.getAll();
        setEntries(map);
        setLoading(false);
    };

    const openEdit = (key: string, label: string) => {
        const row = entries[key];
        setEditing({
            key,
            label,
            title_es: row?.title_es ?? '',
            body_es: row?.body_es ?? '',
            title_en: row?.title_en ?? '',
            body_en: row?.body_en ?? '',
            is_active: row?.is_active ?? true,
        });
    };

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        const res = await helpService.update(editing.key, {
            title_es: editing.title_es,
            body_es: editing.body_es,
            title_en: editing.title_en,
            body_en: editing.body_en,
            is_active: editing.is_active,
        });
        setSaving(false);
        if (res) {
            toast.success('Texto de ayuda guardado');
            setEditing(null);
            load();
        } else {
            toast.error('Error al guardar');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary" /> Textos de Ayuda
                </h3>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    Edita las explicaciones que aparecen en la app (los botones «?» de cada ventana y el diálogo de puntos del perfil).
                    En el cuerpo, una línea en blanco separa párrafos y las líneas que empiezan con «- » se muestran como lista.
                </p>
            </div>

            {loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HELP_ITEMS.map(item => {
                        const row = entries[item.key];
                        return (
                            <Card key={item.key}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                {row?.title_es || item.label}
                                                {row && row.is_active === false && (
                                                    <span className="text-[10px] font-normal text-muted-foreground border rounded-full px-2 py-0.5">Oculto</span>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs mt-1">{item.where}</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => openEdit(item.key, item.label)}>
                                            <Edit className="w-4 h-4 mr-2" /> Editar
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line">
                                        {row?.body_es || '—'}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
                <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar ayuda: {editing?.label}</DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <p className="text-sm font-medium">Visible en la app</p>
                                    <p className="text-xs text-muted-foreground">Si lo ocultas, se usará el texto por defecto del sistema.</p>
                                </div>
                                <Switch checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título (Español)</label>
                                <Input value={editing.title_es || ''} onChange={(e) => setEditing({ ...editing, title_es: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contenido (Español)</label>
                                <Textarea rows={8} value={editing.body_es || ''} onChange={(e) => setEditing({ ...editing, body_es: e.target.value })} />
                            </div>

                            <div className="pt-2 border-t space-y-4">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Versión en Inglés (opcional)</p>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title (English)</label>
                                    <Input value={editing.title_en || ''} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} placeholder="Leave empty to fall back to Spanish" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Content (English)</label>
                                    <Textarea rows={8} value={editing.body_en || ''} onChange={(e) => setEditing({ ...editing, body_en: e.target.value })} placeholder="Leave empty to fall back to Spanish" />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                        <Button onClick={save} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
