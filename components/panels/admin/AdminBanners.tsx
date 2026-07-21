import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Loader2, Edit, Trash2, Plus } from 'lucide-react';
import { bannerService, Banner, promotedBannerService, PromotedBanner } from '../../../services/banner.service';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { ImageWithPositionField } from '../../shared/ImageWithPositionField';
import { imagePositionStyle, ImagePosition } from '../../shared/ImagePositioner';
import { AVAILABLE_BANNERS } from '../BannerGalleryModal';
import { BroadcastModal } from './BroadcastModal';
import { Megaphone } from 'lucide-react';

const APP_PANELS = [
    { key: 'explorar', label: 'Explorar Sitios', defaultImg: '/images/banners/unified/explorar-v2.webp' },
    { key: 'juegos', label: 'Entretenimiento', defaultImg: '/images/banners/unified/entretenimiento-v2.webp' },
    { key: 'paquesepas', label: 'Aprende', defaultImg: '/images/banners/unified/aprende-v2.webp' },
    { key: 'rutas', label: 'Pasaporte de Rutas', defaultImg: '/images/banners/unified/rutas-v2.webp' },
    { key: 'eventos', label: 'Cartelera Cultural', defaultImg: '/images/banners/unified/eventos-v2.webp' },
    { key: 'entertainment_music', label: 'Entretenimiento · Música', defaultImg: '/images/banners/unified/entretenimiento-v2.webp' },
    { key: 'entertainment_stories', label: 'Entretenimiento · Relatos', defaultImg: '/images/banners/unified/aprende-v2.webp' }
];

interface EditingBanner {
    key: string;
    label: string;
    isProfile: boolean;
    image_url: string;
    is_active: boolean;
    title_es: string;
    subtitle_es: string;
    title_en: string;
    subtitle_en: string;
    defaultImg: string;
}

const EMPTY_PROMOTED: Omit<PromotedBanner, 'id'> = {
    title: '',
    subtitle: '',
    image_url: '',
    tag: '',
    target_type: 'route',
    target_id: '',
    is_active: true,
    order_index: 1,
};

export const AdminBanners = () => {
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState<Record<string, Banner>>({});
    const [profileBanners, setProfileBanners] = useState<Record<string, Banner>>({});
    const [promotedBanners, setPromotedBanners] = useState<PromotedBanner[]>([]);

    // Edit Modal State (for panel/profile banners)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<EditingBanner | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Promoted Banner Edit State
    const [promoModalOpen, setPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Partial<PromotedBanner> | null>(null);
    const [savingPromo, setSavingPromo] = useState(false);

    const [broadcastOpen, setBroadcastOpen] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setLoading(true);
        // App banners (scope='app'), keyed by panel key.
        const appBanners = await bannerService.getAppBanners();
        const map: Record<string, Banner> = {};
        appBanners.forEach(b => { map[b.key] = b; });
        setBanners(map);

        // Profile banners (scope='profile'), keyed by the bare banner id.
        const pBanners = await bannerService.getProfileBanners();
        const pMap: Record<string, Banner> = {};
        pBanners.forEach(b => {
            const idKey = b.key.replace('profile_banner_', '');
            pMap[idKey] = b;
        });
        setProfileBanners(pMap);

        const promoted = await promotedBannerService.getAllAdmin();
        setPromotedBanners(promoted);

        setLoading(false);
    };

    const openPromoModal = (banner?: PromotedBanner) => {
        setEditingPromo(banner ? { ...banner } : { ...EMPTY_PROMOTED, order_index: promotedBanners.length + 1 });
        setPromoModalOpen(true);
    };

    const savePromo = async () => {
        if (!editingPromo || !editingPromo.title || !editingPromo.image_url) {
            toast.error('El título y la URL de imagen son obligatorios');
            return;
        }
        setSavingPromo(true);
        try {
            let saved: PromotedBanner | null;
            if ((editingPromo as PromotedBanner).id) {
                saved = await promotedBannerService.update((editingPromo as PromotedBanner).id, editingPromo);
            } else {
                saved = await promotedBannerService.create(editingPromo as Omit<PromotedBanner, 'id'>);
            }
            if (!saved) throw new Error('No se pudo guardar el banner');
            toast.success((editingPromo as PromotedBanner).id ? 'Banner actualizado' : 'Banner creado');
            setPromoModalOpen(false);
            await loadBanners();
        } catch (e) {
            toast.error('Error al guardar');
        } finally {
            setSavingPromo(false);
        }
    };

    const deletePromo = async (id: string) => {
        if (!confirm('¿Eliminar este banner? Esta acción no se puede deshacer.')) return;
        const deleted = await promotedBannerService.delete(id);
        if (!deleted) {
            toast.error('No se pudo eliminar el banner');
            return;
        }
        toast.success('Banner eliminado');
        await loadBanners();
    };

    const handleToggleActive = async (key: string, isActive: boolean, isProfile: boolean = false) => {
        if (isProfile) {
            const current = profileBanners[key] || ({} as Banner);
            const updated = await bannerService.updateProfileBanner(
                key,
                current.title_es || '',
                current.subtitle_es || '',
                current.image_url || '',
                isActive,
                current.title_en,
                current.subtitle_en,
            );
            if (!updated) {
                toast.error('No se pudo actualizar el estado');
                return;
            }
        } else {
            const updated = await bannerService.updateAppBanner(key, { is_active: isActive });
            if (!updated) {
                toast.error('No se pudo actualizar el estado');
                return;
            }
        }
        await loadBanners();
        toast.success(`Estado actualizado`);
    };

    const openEditModal = (key: string, label: string, defaultImg: string, isProfile: boolean) => {
        const currentData = isProfile ? profileBanners[key] : banners[key];
        const hd = isProfile ? AVAILABLE_BANNERS.find(b => b.id === key) : undefined;

        setEditingBanner({
            key,
            label,
            isProfile,
            image_url: currentData?.image_url || defaultImg,
            is_active: currentData ? currentData.is_active : true,
            title_es: currentData?.title_es ?? hd?.title ?? '',
            subtitle_es: currentData?.subtitle_es ?? hd?.unlock_condition ?? '',
            title_en: currentData?.title_en ?? '',
            subtitle_en: currentData?.subtitle_en ?? '',
            defaultImg
        });
        setEditModalOpen(true);
    };

    const handleImageUpload = async (file: File) => {
        if (!editingBanner) return;
        try {
            setUploadingImage(true);
            const fileExt = file.name.split('.').pop();
            const prefix = editingBanner.isProfile ? 'profile_banner' : 'banner';
            const fileName = `${prefix}_${editingBanner.key}_${Date.now()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setEditingBanner({ ...editingBanner, image_url: publicUrl });
            toast.success("Imagen subida. No olvides guardar los cambios.");
        } catch (error: any) {
            console.error(error);
            toast.error("Error al subir imagen: " + error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const saveBannerChanges = async () => {
        if (!editingBanner) return;
        setSavingEdit(true);
        try {
            let updated: Banner | null;
            if (editingBanner.isProfile) {
                updated = await bannerService.updateProfileBanner(
                    editingBanner.key,
                    editingBanner.title_es,
                    editingBanner.subtitle_es,
                    editingBanner.image_url,
                    editingBanner.is_active,
                    editingBanner.title_en,
                    editingBanner.subtitle_en,
                );
            } else {
                updated = await bannerService.updateAppBanner(editingBanner.key, {
                    title_es: editingBanner.title_es,
                    subtitle_es: editingBanner.subtitle_es,
                    title_en: editingBanner.title_en,
                    subtitle_en: editingBanner.subtitle_en,
                    image_url: editingBanner.image_url,
                    is_active: editingBanner.is_active,
                });
            }
            if (!updated) throw new Error('No se pudo guardar el banner');
            toast.success('Cambios guardados exitosamente');
            setEditModalOpen(false);
            await loadBanners();
        } catch (e) {
            toast.error("Error al guardar cambios");
        } finally {
            setSavingEdit(false);
        }
    };

    const renderBannerCard = (key: string, label: string, defaultImg: string, isProfile: boolean) => {
        const currentBanner = isProfile ? profileBanners[key] : banners[key];
        const displayImg = (currentBanner?.is_active && currentBanner?.image_url) ? currentBanner.image_url : defaultImg;

        return (
            <Card key={key} className="overflow-hidden">
                <div className="h-32 bg-muted relative border-b overflow-hidden group">
                    <img src={displayImg} alt={label} className="w-full h-full object-cover object-right opacity-80 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-full border shadow-sm pointer-events-auto flex items-center gap-2">
                            <Switch
                                checked={currentBanner?.is_active ?? true}
                                onChange={(e) => handleToggleActive(key, e.target.checked, isProfile)}
                            />
                            <span className="text-xs font-bold">{currentBanner?.is_active ?? true ? 'Activo' : 'Inactivo'}</span>
                        </div>
                    </div>
                </div>
                <CardHeader className="py-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{currentBanner?.title_es || label}</CardTitle>
                            <CardDescription className="font-mono text-[10px] mt-1">{key}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(key, label, defaultImg, isProfile)}>
                            <Edit className="w-4 h-4 mr-2" /> Editar
                        </Button>
                    </div>
                </CardHeader>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-primary" /> Gestión de Banners
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        Edita las imágenes y los textos (título y subtítulo) de las cabeceras de las vistas, y las recompensas del perfil.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setBroadcastOpen(true)} className="shrink-0 text-blue-600 hover:text-blue-700">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Enviar Alerta Masiva
                </Button>
            </div>

            <Tabs defaultValue="imperdibles" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="imperdibles">Imperdibles</TabsTrigger>
                    <TabsTrigger value="app">Banners de Paneles</TabsTrigger>
                    <TabsTrigger value="profile">Banners de Perfil</TabsTrigger>
                </TabsList>

                {loading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : (
                    <>
                        <TabsContent value="imperdibles">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-sm text-muted-foreground">Banners promocionales que aparecen en la sección "Imperdibles" del panel de Explorar.</p>
                                <Button size="sm" onClick={() => openPromoModal()}><Plus className="w-4 h-4 mr-2" />Nuevo Banner</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {promotedBanners.map(b => (
                                    <Card key={b.id} className="overflow-hidden">
                                        <div className="h-36 relative overflow-hidden bg-muted">
                                            {b.image_url && <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />}
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{b.is_active ? 'Activo' : 'Inactivo'}</span>
                                            </div>
                                        </div>
                                        <CardHeader className="py-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-sm truncate">{b.title}</CardTitle>
                                                    <CardDescription className="text-xs mt-0.5">{b.tag} · {b.target_type} {b.target_id ? `→ ${b.target_id.slice(0,8)}...` : ''}</CardDescription>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={`Editar ${b.title}`} onClick={() => openPromoModal(b)}><Edit className="w-3.5 h-3.5" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" aria-label={`Eliminar ${b.title}`} onClick={() => deletePromo(b.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                                {promotedBanners.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                        <p>No hay banners promocionales configurados.</p>
                                        <Button variant="outline" className="mt-3" onClick={() => openPromoModal()}>Crear el primero</Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="app">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {APP_PANELS.map(panel => renderBannerCard(panel.key, panel.label, panel.defaultImg, false))}
                            </div>
                        </TabsContent>

                        <TabsContent value="profile">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {AVAILABLE_BANNERS.map(banner => renderBannerCard(banner.id, banner.title, banner.image_url, true))}
                            </div>
                        </TabsContent>
                    </>
                )}
            </Tabs>

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar {editingBanner?.label}</DialogTitle>
                    </DialogHeader>
                    {editingBanner && (
                        <div className="space-y-4 py-4">
                            <div className="h-32 w-full rounded-md border overflow-hidden relative group">
                                <img src={editingBanner.image_url} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-md font-medium text-sm flex items-center shadow-lg">
                                        {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                        Cambiar Imagen
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                                        }} disabled={uploadingImage} />
                                    </label>
                                </div>
                            </div>

                            {/* Spanish */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título (Español)</label>
                                <Input
                                    value={editingBanner.title_es}
                                    onChange={(e) => setEditingBanner({ ...editingBanner, title_es: e.target.value })}
                                    placeholder={editingBanner.isProfile ? "Ej. Bulevar del Río" : "Ej. Pasaporte de Rutas"}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {editingBanner.isProfile ? 'Condición de Desbloqueo (Español)' : 'Subtítulo (Español)'}
                                </label>
                                <Textarea
                                    value={editingBanner.subtitle_es}
                                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle_es: e.target.value })}
                                    placeholder={editingBanner.isProfile ? "Ej. Deja tu primera reseña" : "Descripción corta del banner"}
                                    rows={2}
                                />
                            </div>

                            {/* English */}
                            <div className="pt-2 border-t space-y-4">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Versión en Inglés (opcional)</p>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title (English)</label>
                                    <Input
                                        value={editingBanner.title_en}
                                        onChange={(e) => setEditingBanner({ ...editingBanner, title_en: e.target.value })}
                                        placeholder="Leave empty to fall back to Spanish"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {editingBanner.isProfile ? 'Unlock Condition (English)' : 'Subtitle (English)'}
                                    </label>
                                    <Textarea
                                        value={editingBanner.subtitle_en}
                                        onChange={(e) => setEditingBanner({ ...editingBanner, subtitle_en: e.target.value })}
                                        placeholder="Leave empty to fall back to Spanish"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
                        <Button onClick={saveBannerChanges} disabled={savingEdit || uploadingImage}>
                            {savingEdit ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Promoted Banner Edit/Create Modal */}
            <Dialog open={promoModalOpen} onOpenChange={setPromoModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>{(editingPromo as PromotedBanner)?.id ? 'Editar Banner Promocional' : 'Nuevo Banner Promocional'}</DialogTitle>
                    </DialogHeader>
                    {editingPromo && (
                        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título *</label>
                                <Input
                                    value={editingPromo.title || ''}
                                    onChange={(e) => setEditingPromo({...editingPromo, title: e.target.value})}
                                    placeholder="Ej. Ruta Histórica y Colonial"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subtítulo</label>
                                <Input
                                    value={editingPromo.subtitle || ''}
                                    onChange={(e) => setEditingPromo({...editingPromo, subtitle: e.target.value})}
                                    placeholder="Ej. Descubre los vestigios del Cali colonial"
                                />
                            </div>
                            <ImageWithPositionField
                                label="URL de Imagen"
                                required
                                url={editingPromo.image_url || ''}
                                onUrlChange={(url) => setEditingPromo({ ...editingPromo, image_url: url })}
                                position={editingPromo.image_position ?? null}
                                onPositionChange={(pos) => setEditingPromo({ ...editingPromo, image_position: pos })}
                                placeholder="/images/imperdibles/mi_banner.png"
                                aspectClassName="aspect-[16/9]"
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Etiqueta (Tag)</label>
                                <Input
                                    value={editingPromo.tag || ''}
                                    onChange={(e) => setEditingPromo({...editingPromo, tag: e.target.value})}
                                    placeholder="Ej. Ruta Recomendada, Evento Destacado"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo de Destino</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editingPromo.target_type || 'route'}
                                        onChange={(e) => setEditingPromo({ ...editingPromo, target_type: e.target.value as PromotedBanner['target_type'] })}
                                    >
                                        <option value="route">Ruta</option>
                                        <option value="event">Evento</option>
                                        <option value="game">Juego</option>
                                        <option value="url">URL externa</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">ID del Destino</label>
                                    <Input
                                        value={editingPromo.target_id || ''}
                                        onChange={(e) => setEditingPromo({...editingPromo, target_id: e.target.value})}
                                        placeholder="ID o URL"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Orden</label>
                                    <Input
                                        type="number"
                                        value={editingPromo.order_index || 1}
                                        onChange={(e) => setEditingPromo({...editingPromo, order_index: parseInt(e.target.value) || 1})}
                                        min={1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estado</label>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Switch
                                            checked={editingPromo.is_active ?? true}
                                            onChange={(e) => setEditingPromo({...editingPromo, is_active: e.target.checked})}
                                        />
                                        <span className="text-sm">{editingPromo.is_active ? 'Activo' : 'Inactivo'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPromoModalOpen(false)}>Cancelar</Button>
                        <Button onClick={savePromo} disabled={savingPromo}>
                            {savingPromo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <BroadcastModal open={broadcastOpen} onOpenChange={setBroadcastOpen} />
        </div>
    );
};
