import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Check, Lock, Image as ImageIcon } from 'lucide-react';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface BannerItem {
    id: string;
    title: string;
    image_url: string;
    unlock_condition: string;
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
    onBannerSelected: (bannerId: string) => void;
    dynamicBanners: BannerItem[];
}

export const BannerGalleryModal: React.FC<BannerGalleryModalProps> = ({ 
    open, 
    onOpenChange, 
    unlockedBanners, 
    selectedBannerId,
    onBannerSelected,
    dynamicBanners
}) => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);

    const handleSelect = async (bannerId: string) => {
        if (!user) return;
        setSaving(true);
        try {
            await userService.updateProfileData(user.id, { selected_banner_id: bannerId });
            onBannerSelected(bannerId);
            toast.success('¡Banner de perfil actualizado!');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar el banner');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <ImageIcon className="w-6 h-6 text-primary" />
                        Galería de Banners Exclusivos
                    </DialogTitle>
                    <DialogDescription>
                        Personaliza tu perfil con ilustraciones de Cali. ¡Desbloquea más arte interactuando con la app!
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {dynamicBanners.map((banner) => {
                        const isUnlocked = unlockedBanners.includes(banner.id);
                        const isSelected = selectedBannerId === banner.id;

                        return (
                            <div 
                                key={banner.id} 
                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${isSelected ? 'border-primary shadow-md' : 'border-border/50'} ${!isUnlocked && 'opacity-80'}`}
                            >
                                <div className="h-32 w-full relative">
                                    <img 
                                        src={banner.image_url} 
                                        alt={banner.title} 
                                        className={`w-full h-full object-cover transition-all ${!isUnlocked ? 'grayscale blur-[2px]' : 'hover:scale-105'}`}
                                    />
                                    {!isUnlocked && (
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center">
                                            <Lock className="w-8 h-8 mb-2 opacity-80" />
                                            <span className="text-xs font-medium bg-black/60 px-2 py-1 rounded-md">{banner.unlock_condition}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-card flex items-center justify-between">
                                    <span className="font-semibold text-sm">{banner.title}</span>
                                    {isUnlocked ? (
                                        <Button 
                                            size="sm" 
                                            variant={isSelected ? "default" : "outline"} 
                                            className="rounded-full h-8 px-4"
                                            disabled={isSelected || saving}
                                            onClick={() => handleSelect(banner.id)}
                                        >
                                            {isSelected ? <><Check className="w-4 h-4 mr-1"/> Equipado</> : 'Equipar'}
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="ghost" disabled className="h-8 rounded-full text-xs">
                                            Bloqueado
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};
