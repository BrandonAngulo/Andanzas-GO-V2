import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Loader2, Edit } from 'lucide-react';
import { bannerService, Banner } from '../../../services/banner.service';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
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

export const AdminBanners = () => {
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState<Record<string, Banner>>({});
    const [profileBanners, setProfileBanners] = useState<Record<string, Banner>>({});

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<EditingBanner | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

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

        setLoading(false);
    };

    const handleToggleActive = async (key: string, isActive: boolean, isProfile: boolean = false) => {
        if (isProfile) {
            const current = profileBanners[key] || ({} as Banner);
            await bannerService.updateProfileBanner(
                key,
                current.title_es || '',
                current.subtitle_es || '',
                current.image_url || '',
                isActive,
                current.title_en,
                current.subtitle_en,
            );
        } else {
            await bannerService.updateAppBanner(key, { is_active: isActive });
        }
        loadBanners();
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
            if (editingBanner.isProfile) {
                await bannerService.updateProfileBanner(
                    editingBanner.key,
                    editingBanner.title_es,
                    editingBanner.subtitle_es,
                    editingBanner.image_url,
                    editingBanner.is_active,
                    editingBanner.title_en,
                    editingBanner.subtitle_en,
                );
            } else {
                await bannerService.updateAppBanner(editingBanner.key, {
                    title_es: editingBanner.title_es,
                    subtitle_es: editingBanner.subtitle_es,
                    title_en: editingBanner.title_en,
                    subtitle_en: editingBanner.subtitle_en,
                    image_url: editingBanner.image_url,
                    is_active: editingBanner.is_active,
                });
            }
            toast.success('Cambios guardados exitosamente');
            setEditModalOpen(false);
            loadBanners();
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

            <Tabs defaultValue="app" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="app">Banners de la App</TabsTrigger>
                    <TabsTrigger value="profile">Banners de Perfil (Recompensas)</TabsTrigger>
                </TabsList>

                {loading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : (
                    <>
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

            <BroadcastModal open={broadcastOpen} onOpenChange={setBroadcastOpen} />
        </div>
    );
};
