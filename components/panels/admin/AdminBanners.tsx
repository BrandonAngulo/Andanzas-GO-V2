import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { bannerService, Banner } from '../../../services/banner.service';
import { Switch } from '../../ui/switch';

const PANELS = [
    { key: 'explorar', label: 'Explorar Sitios', defaultImg: '/images/banner_explorar.png' },
    { key: 'juegos', label: 'Zona de Juegos', defaultImg: '/images/banner_juegos.png' },
    { key: 'paquesepas', label: 'Pa\' que sepás', defaultImg: '/images/banner_aprende.png' },
    { key: 'rutas', label: 'Pasaporte de Rutas', defaultImg: '/images/banner_rutas.png' },
    { key: 'eventos', label: 'Cartelera Cultural', defaultImg: '/images/banner_eventos.png' }
];

export const AdminBanners = () => {
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState<Record<string, Banner>>({});
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setLoading(true);
        const { data, error } = await supabase
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
        setLoading(false);
    };

    const handleToggleActive = async (panelKey: string, isActive: boolean) => {
        const currentImageUrl = banners[panelKey]?.image_url || '';
        await bannerService.updateBanner(panelKey, currentImageUrl, isActive);
        loadBanners();
        toast.success(`Banner de ${panelKey} actualizado`);
    };

    const handleImageUpload = async (panelKey: string, file: File) => {
        try {
            setUploadingImage(panelKey);
            const fileExt = file.name.split('.').pop();
            const fileName = `banner_${panelKey}_${Date.now()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            await bannerService.updateBanner(panelKey, publicUrl, true);
            await loadBanners();
            toast.success("Imagen de banner actualizada exitosamente");
        } catch (error: any) {
            console.error(error);
            toast.error("Error al subir imagen: " + error.message);
        } finally {
            setUploadingImage(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-primary" /> Gestión de Banners
                </h3>
                <p className="text-muted-foreground text-sm">
                    Sube y administra las imágenes de cabecera de cada ventana. Actívalas o desactívalas en tiempo real. 
                    Si un banner está desactivado, se usará la ilustración por defecto.
                </p>
            </div>

            {loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PANELS.map((panel) => {
                        const currentBanner = banners[panel.key];
                        const displayImg = (currentBanner?.is_active && currentBanner?.image_url) ? currentBanner.image_url : panel.defaultImg;
                        
                        return (
                            <Card key={panel.key} className="overflow-hidden">
                                <div className="h-32 bg-muted relative border-b overflow-hidden">
                                    <img src={displayImg} alt={panel.label} className="w-full h-full object-cover object-right opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full border shadow-sm pointer-events-auto flex items-center gap-2">
                                            <Switch 
                                                checked={currentBanner?.is_active || false} 
                                                onChange={(e) => handleToggleActive(panel.key, e.target.checked)}
                                            />
                                            <span className="text-xs font-bold">{currentBanner?.is_active ? 'Activo' : 'Desactivado'}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardHeader className="py-4">
                                    <CardTitle className="text-lg">{panel.label}</CardTitle>
                                    <CardDescription>
                                        ID: <span className="font-mono text-xs">{panel.key}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <Input 
                                                type="file" 
                                                accept="image/*"
                                                disabled={uploadingImage === panel.key}
                                                className="cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(panel.key, file);
                                                }}
                                            />
                                        </div>
                                        {uploadingImage === panel.key && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2">
                                        Recomendado: 1200x400px (JPG/PNG). La imagen se alineará a la derecha.
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
