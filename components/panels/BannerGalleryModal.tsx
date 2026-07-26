import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { ArrowLeft, Check, Lock, Image as ImageIcon, Loader2, Move } from 'lucide-react';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { DEFAULT_IMAGE_POSITION, ImagePosition, ImagePositioner, imagePositionStyle, normalizeImagePosition } from '../shared/ImagePositioner';

interface BannerItem {
    id: string;
    title: string;
    image_url: string;
    unlock_condition: string;
    image_position?: { x: number; y: number; zoom: number } | null;
}

export const AVAILABLE_BANNERS: BannerItem[] = [
    {
        id: 'banner_bulevar_rio',
        title: 'Bulevar del Río',
        image_url: '/images/banners/banner_bulevar_rio.png',
        unlock_condition: 'Deja tu primera reseña'
    },
    {
        id: 'banner_la_ermita',
        title: 'La Ermita',
        image_url: '/images/banners/banner_la_ermita.png',
        unlock_condition: 'Guarda tu primera ruta en "Por Andar"'
    },
    {
        id: 'banner_tres_cruces',
        title: 'Cerro Tres Cruces',
        image_url: '/images/banners/banner_tres_cruces.png',
        unlock_condition: 'Alcanza el Nivel 3 de Explorador'
    },
    {
        id: 'banner_torre_cali',
        title: 'Torre de Cali',
        image_url: '/images/banners/banner_torre_cali.png',
        unlock_condition: 'Completa tu primera ruta guiada'
    },
    {
        id: 'banner_bulevar_oriente',
        title: 'Bulevar de Oriente',
        image_url: '/images/banners/banner_bulevar_oriente.png',
        unlock_condition: 'Gana 5 insignias culturales'
    },
    {
        id: 'banner_san_antonio',
        title: 'Capilla San Antonio',
        image_url: '/images/banners/banner_san_antonio.png',
        unlock_condition: 'Invita a un amigo a usar la app'
    }
];

interface BannerGalleryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    unlockedBanners: string[];
    selectedBannerId?: string;
    selectedPosition?: ImagePosition | null;
    onBannerSelected: (bannerId: string, position: ImagePosition) => void;
    dynamicBanners: BannerItem[];
}

export const BannerGalleryModal: React.FC<BannerGalleryModalProps> = ({ 
    open, 
    onOpenChange, 
    unlockedBanners, 
    selectedBannerId,
    selectedPosition,
    onBannerSelected,
    dynamicBanners
}) => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [previewBanner, setPreviewBanner] = useState<BannerItem | null>(null);
    const [previewPosition, setPreviewPosition] = useState<ImagePosition>(DEFAULT_IMAGE_POSITION);

    const openPreview = (banner: BannerItem) => {
        const initialPosition = banner.id === selectedBannerId
            ? selectedPosition ?? banner.image_position
            : banner.image_position;
        setPreviewPosition(normalizeImagePosition(initialPosition));
        setPreviewBanner(banner);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) setPreviewBanner(null);
        onOpenChange(nextOpen);
    };

    const handleApply = async () => {
        if (!user || !previewBanner) return;
        setSaving(true);
        try {
            await userService.updateProfileData(user.id, {
                selected_banner_id: previewBanner.id,
                banner_position: previewPosition,
            });
            onBannerSelected(previewBanner.id, previewPosition);
            toast.success('Fondo y encuadre actualizados.');
            handleOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('No se pudo actualizar el fondo.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        {previewBanner ? <Move className="h-6 w-6 text-primary" /> : <ImageIcon className="h-6 w-6 text-primary" />}
                        {previewBanner ? 'Previsualiza tu fondo' : 'Elige el fondo de tu perfil'}
                    </DialogTitle>
                    <DialogDescription>
                        {previewBanner
                            ? 'Ajusta la imagen tal como quieres verla antes de aplicarla.'
                            : 'Explora las ilustraciones que has desbloqueado y previsualiza el resultado.'}
                    </DialogDescription>
                </DialogHeader>

                {previewBanner ? (
                    <div className="mt-3 space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-primary/15 bg-muted/30">
                            <div className="relative aspect-[16/6] overflow-hidden">
                                <img
                                    src={previewBanner.image_url}
                                    alt={`Previsualización de ${previewBanner.title}`}
                                    className="absolute inset-0 h-full w-full"
                                    style={imagePositionStyle(previewPosition)}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 pt-12 text-white">
                                    <p className="font-bold">{previewBanner.title}</p>
                                    <p className="text-xs text-white/80">Así se verá en la cabecera de tu perfil.</p>
                                </div>
                            </div>
                        </div>
                        <ImagePositioner
                            imageUrl={previewBanner.image_url}
                            value={previewPosition}
                            onChange={setPreviewPosition}
                            aspectClassName="aspect-[16/6]"
                        />
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-full"
                                onClick={() => setPreviewBanner(null)}
                                disabled={saving}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a la galería
                            </Button>
                            <Button type="button" className="rounded-full" onClick={handleApply} disabled={saving}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                Aplicar fondo
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {dynamicBanners.map((banner) => {
                            const isSelected = selectedBannerId === banner.id;
                            const isUnlocked = isSelected || unlockedBanners.includes(banner.id);

                            return (
                                <article
                                    key={banner.id}
                                    className={`relative overflow-hidden rounded-2xl border-2 transition-all ${isSelected ? 'border-primary shadow-md' : 'border-border/50'} ${!isUnlocked ? 'opacity-80' : ''}`}
                                >
                                    <div className="relative h-32 w-full">
                                        <img
                                            src={banner.image_url}
                                            alt={banner.title}
                                            className={`h-full w-full object-cover transition-all ${!isUnlocked ? 'grayscale blur-[2px]' : ''}`}
                                            style={isSelected ? imagePositionStyle(selectedPosition ?? banner.image_position) : imagePositionStyle(banner.image_position)}
                                        />
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 p-4 text-center text-white">
                                                <Lock className="mb-2 h-7 w-7 opacity-90" />
                                                <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-medium">{banner.unlock_condition}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-3 bg-card p-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">{banner.title}</p>
                                            {isSelected && <p className="text-[11px] font-medium text-primary">Fondo actual</p>}
                                        </div>
                                        {isUnlocked ? (
                                            <Button
                                                size="sm"
                                                variant={isSelected ? 'default' : 'outline'}
                                                className="h-8 shrink-0 rounded-full px-4"
                                                disabled={saving}
                                                onClick={() => openPreview(banner)}
                                            >
                                                {isSelected ? 'Ajustar' : 'Previsualizar'}
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="ghost" disabled className="h-8 rounded-full text-xs">
                                                Bloqueado
                                            </Button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
