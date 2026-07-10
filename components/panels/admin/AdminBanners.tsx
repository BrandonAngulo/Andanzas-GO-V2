import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Loader2, Edit, Check } from 'lucide-react';
import { bannerService, Banner } from '../../../services/banner.service';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { AVAILABLE_BANNERS } from '../BannerGalleryModal';
import { BroadcastModal } from './BroadcastModal';
import { Megaphone } from 'lucide-react';

const APP_PANELS = [
    { key: 'explorar', label: 'Explorar Sitios', defaultImg: '/images/banner_explorar.png' },
    { key: 'juegos', label: 'Zona de Juegos', defaultImg: '/images/banner_juegos.png' },
    { key: 'paquesepas', label: 'Pa\' que sepás', defaultImg: '/images/banner_aprende.png' },
    { key: 'rutas', label: 'Pasaporte de Rutas', defaultImg: '/images/banner_rutas.png' },
    { key: 'eventos', label: 'Cartelera Cultural', defaultImg: '/images/banner_eventos.png' }
];

export const AdminBanners = () => {
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState<Record<string, Banner>>({});
    const [profileBanners, setProfileBanners] = useState<Record<string, Banner>>({});
    
    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<any>(null); // holds data being edited
    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const [broadcastOpen, setBroadcastOpen] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setLoading(true);
        // Load App Banners
        const { data } = await supabase
            .from('institutional_content')
            .select('*')
            .like('section_key', 'banner_%');
            
        if (data) {
            const map: Record<string, Banner> = {};
            data.forEach(b => {
                const panelKey = b.section_key.replace('banner_', '');
                map[panelKey] = b as Banner;
            });
            setBanners(map);
        }

        // Load Profile Banners
        const pBanners = await bannerService.getProfileBanners();
        const pMap: Record<string, Banner> = {};
        pBanners.forEach(b => {
            const idKey = b.section_key.replace('profile_banner_', '');
            pMap[idKey] = b;
        });
        setProfileBanners(pMap);

        setLoading(false);
    };

    const handleToggleActive = async (key: string, isActive: boolean, isProfile: boolean = false) => {
        if (isProfile) {
            const current = profileBanners[key] || {};
            await bannerService.updateProfileBanner(key, current.title || '', current.content_text || '', current.image_url || '', isActive);
        } else {
            const currentImageUrl = banners[key]?.image_url || '';
            await bannerService.updateBanner(key, currentImageUrl, isActive);
        }
        loadBanners();
        toast.success(`Estado actualizado`);
    };

    const openEditModal = (key: string, label: string, defaultImg: string, isProfile: boolean) => {
        const currentData = isProfile ? profileBanners[key] : banners[key];
        let initialTitle = '';
        let initialDesc = '';
        if (isProfile) {
            const hd = AVAILABLE_BANNERS.find(b => b.id === key);
            initialTitle = currentData?.title || hd?.title || '';
            initialDesc = currentData?.content_text || hd?.unlock_condition || '';
        }

        setEditingBanner({
            key,
            label,
            isProfile,
            image_url: currentData?.image_url || defaultImg,
            is_active: currentData ? currentData.is_active : true,
            title: initialTitle,
            description: initialDesc,
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
                    editingBanner.title, 
                    editingBanner.description, 
                    editingBanner.image_url, 
                    editingBanner.is_active
                );
            } else {
                await bannerService.updateBanner(
                    editingBanner.key, 
                    editingBanner.image_url, 
                    editingBanner.is_active
                );
            }
            toast.success('Cambios guardados exitosamente');
            setEditModalOpen(false);
            loadBanners();
        } catch(e) {
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
                                onCheckedChange={(checked) => handleToggleActive(key, checked, isProfile)}
                            />
                            <span className="text-xs font-bold">{currentBanner?.is_active ?? true ? 'Activo' : 'Inactivo'}</span>
                        </div>
                    </div>
                </div>
                <CardHeader className="py-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{label}</CardTitle>
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
                        Administra las imágenes de cabecera de las vistas y las recompensas del perfil.
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
                <DialogContent className="sm:max-w-[500px]">
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

                            {editingBanner.isProfile && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Título del Banner</label>
                                        <Input 
                                            value={editingBanner.title} 
                                            onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})} 
                                            placeholder="Ej. Bulevar del Río"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Condición de Desbloqueo (Descripción)</label>
                                        <Textarea 
                                            value={editingBanner.description} 
                                            onChange={(e) => setEditingBanner({...editingBanner, description: e.target.value})} 
                                            placeholder="Ej. Deja tu primera reseña"
                                            rows={2}
                                        />
                                    </div>
                                </>
                            )}
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
