import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, Loader2, Pencil, Plus, Search, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { badgesService, BadgeRow, BadgeInput } from '../../../services/badges.service';
import { iconMap } from '../../../services/gamification.service';

const ICON_NAMES = Object.keys(iconMap);
const slugify = (s: string) => s.normalize('NFD').replace(/[^\x00-\x7F]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

interface BadgeForm {
    id: string; nombre: string; nombre_en: string; descripcion: string; descripcion_en: string;
    icono_name: string; image_url: string; family_key: string; tier: string;
}
const EMPTY: BadgeForm = { id: '', nombre: '', nombre_en: '', descripcion: '', descripcion_en: '', icono_name: 'Award', image_url: '', family_key: '', tier: '' };

const toForm = (b: BadgeRow): BadgeForm => ({
    id: b.id, nombre: b.nombre, nombre_en: b.nombre_en ?? '', descripcion: b.descripcion, descripcion_en: b.descripcion_en ?? '',
    icono_name: b.icono_name, image_url: b.image_url ?? '', family_key: b.family_key ?? '', tier: b.tier != null ? String(b.tier) : '',
});

export function AdminBadges(): JSX.Element {
    const [badges, setBadges] = useState<BadgeRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const [editorOpen, setEditorOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [form, setForm] = useState<BadgeForm>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toDelete, setToDelete] = useState<BadgeRow | null>(null);
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try { setBadges(await badgesService.list()); }
        catch (error) { console.error(error); toast.error('No se pudieron cargar las insignias.'); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { void load(); }, [load]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return badges;
        return badges.filter(b => b.nombre.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || (b.family_key ?? '').toLowerCase().includes(q));
    }, [badges, query]);

    const openCreate = () => { setForm(EMPTY); setIsNew(true); setEditorOpen(true); };
    const openEdit = (b: BadgeRow) => { setForm(toForm(b)); setIsNew(false); setEditorOpen(true); };
    const set = (patch: Partial<BadgeForm>) => setForm(prev => ({ ...prev, ...patch }));

    const handleUpload = async (file: File) => {
        setUploading(true);
        try { set({ image_url: await badgesService.uploadImage(file) }); toast.success('Imagen subida. No olvides guardar.'); }
        catch (error: any) { toast.error('Error al subir imagen: ' + (error?.message ?? '')); }
        finally { setUploading(false); }
    };

    const save = async () => {
        const id = (isNew ? (form.id.trim() || slugify(form.nombre)) : form.id).trim();
        if (!id || !form.nombre.trim() || !form.descripcion.trim()) { toast.error('Id, nombre y descripción son obligatorios.'); return; }
        if (isNew && badges.some(b => b.id === id)) { toast.error(`Ya existe una insignia con el id «${id}».`); return; }
        const payload: BadgeInput = {
            id, nombre: form.nombre.trim(), nombre_en: form.nombre_en.trim() || null,
            descripcion: form.descripcion.trim(), descripcion_en: form.descripcion_en.trim() || null,
            icono_name: form.icono_name || 'Award', image_url: form.image_url.trim() || null,
            family_key: form.family_key.trim() || null, tier: form.tier.trim() ? parseInt(form.tier, 10) : null,
        };
        setSaving(true);
        try {
            if (isNew) await badgesService.create(payload); else await badgesService.update(id, payload);
            toast.success(isNew ? 'Insignia creada.' : 'Insignia actualizada.');
            setEditorOpen(false);
            await load();
        } catch (error: any) { console.error(error); toast.error('No se pudo guardar. Revisa tus permisos.'); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try { await badgesService.remove(toDelete.id); toast.success('Insignia eliminada.'); setToDelete(null); await load(); }
        catch (error) { console.error(error); toast.error('No se pudo eliminar. Revisa tus permisos.'); }
        finally { setDeleting(false); }
    };

    const PreviewIcon = iconMap[form.icono_name] || Award;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold"><Award className="h-6 w-6 text-primary" />Gestión de insignias</h2>
                    <p className="mt-1 text-muted-foreground">Crea, edita y elimina las insignias que ganan los usuarios.</p>
                </div>
                <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Nueva insignia</Button>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-muted-foreground">
                Las insignias <strong className="text-foreground">progresivas</strong> comparten un <code>family_key</code> y se ordenan por <code>tier</code> (1 = bronce, 2 = plata, 3 = oro). Las de logro puntual dejan ambos vacíos. El <em>otorgamiento</em> es automático según la actividad; aquí solo se gestionan las definiciones.
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Insignias</CardTitle>
                    <CardDescription>{badges.length} definidas</CardDescription>
                    <div className="relative pt-2">
                        <Search className="absolute left-3 top-[1.375rem] h-4 w-4 text-muted-foreground" />
                        <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-9" placeholder="Buscar por nombre, id o familia" aria-label="Buscar insignias" />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex min-h-32 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No hay insignias que coincidan.</div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {filtered.map(b => {
                                const Icon = iconMap[b.icono_name] || Award;
                                return (
                                    <div key={b.id} className="flex items-start gap-3 rounded-xl border p-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                                            {b.image_url ? <img src={b.image_url} alt={b.nombre} className="h-full w-full object-cover" /> : <Icon className="h-6 w-6 text-primary" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="truncate font-semibold">{b.nombre}</span>
                                                {b.family_key && <Badge variant="secondary" className="text-[10px]">{b.family_key}{b.tier ? ` · T${b.tier}` : ''}</Badge>}
                                            </div>
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{b.descripcion}</p>
                                            <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{b.id}</p>
                                        </div>
                                        <div className="flex shrink-0 flex-col gap-1">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(b)} aria-label={`Editar ${b.nombre}`}><Pencil className="h-4 w-4" /></Button>
                                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setToDelete(b)} aria-label={`Eliminar ${b.nombre}`}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                <DialogContent className="max-h-[85vh] max-w-[560px] overflow-y-auto">
                    <DialogHeader><DialogTitle>{isNew ? 'Nueva insignia' : `Editar «${form.nombre}»`}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-3">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
                                {form.image_url ? <img src={form.image_url} alt="preview" className="h-full w-full object-cover" /> : <PreviewIcon className="h-8 w-8 text-primary" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <label className="text-sm font-medium">Ícono</label>
                                <select value={form.icono_name} onChange={e => set({ icono_name: e.target.value })} className="mt-1 h-10 w-full rounded-md border bg-background px-2 text-sm">
                                    {ICON_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <p className="mt-1 text-[11px] text-muted-foreground">Se usa cuando no hay imagen. La imagen (opcional) tiene prioridad.</p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Id (clave única){isNew ? ' *' : ''}</label>
                                <Input value={form.id} onChange={e => set({ id: e.target.value })} disabled={!isNew} placeholder="insignia-fav-1" className="font-mono text-xs" />
                                {isNew && <p className="text-[11px] text-muted-foreground">Si lo dejas vacío se genera del nombre. No se puede cambiar luego.</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nombre (ES) *</label>
                                <Input value={form.nombre} onChange={e => set({ nombre: e.target.value })} placeholder="Primer Favorito" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Descripción (ES) *</label>
                            <Textarea value={form.descripcion} onChange={e => set({ descripcion: e.target.value })} rows={2} placeholder="Guardaste tu primer lugar favorito." />
                        </div>

                        <div className="space-y-3 rounded-xl border border-dashed p-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inglés (opcional)</p>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Name (EN)</label>
                                <Input value={form.nombre_en} onChange={e => set({ nombre_en: e.target.value })} placeholder="First Favorite" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Description (EN)</label>
                                <Textarea value={form.descripcion_en} onChange={e => set({ descripcion_en: e.target.value })} rows={2} placeholder="You saved your first favorite place." />
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Familia (progresiva)</label>
                                <Input value={form.family_key} onChange={e => set({ family_key: e.target.value })} placeholder="fav (vacío si es puntual)" className="font-mono text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nivel (tier)</label>
                                <Input type="number" min={1} value={form.tier} onChange={e => set({ tier: e.target.value })} placeholder="1, 2, 3…" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Imagen (opcional)</label>
                            <div className="flex gap-2">
                                <Input value={form.image_url} onChange={e => set({ image_url: e.target.value })} placeholder="URL de la ilustración" />
                                <label className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-medium hover:bg-muted">
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />} Subir
                                    <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={e => { if (e.target.files?.[0]) void handleUpload(e.target.files[0]); }} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancelar</Button>
                        <Button onClick={() => void save()} disabled={saving || uploading}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={open => { if (!open && !deleting) setToDelete(null); }}
                title="¿Eliminar esta insignia?"
                description={toDelete ? `Se eliminará «${toDelete.nombre}» de forma permanente. Atención: los usuarios que ya la hayan ganado la perderán (se borran sus registros asociados).` : undefined}
                confirmText="Eliminar"
                destructive
                onConfirm={() => { void confirmDelete(); }}
            />
        </div>
    );
}
