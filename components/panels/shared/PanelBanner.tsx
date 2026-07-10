import React, { useEffect, useState } from 'react';
import { bannerService } from '../../../services/banner.service';
import { AndiGuia } from '../../shared/AndiGuia';
import { cn } from '../../../lib/utils';

interface PanelBannerProps {
    panelKey: string;
    defaultImage: string;
    title: React.ReactNode;
    description: React.ReactNode;
    andiMessage?: string;
    gradientClass?: string;
    children?: React.ReactNode; // For extra content like CategoryCarousel
}

export const PanelBanner: React.FC<PanelBannerProps> = ({
    panelKey,
    defaultImage,
    title,
    description,
    andiMessage,
    gradientClass = "from-blue-50/95 via-blue-50/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 dark:to-transparent",
    children
}) => {
    const [bgImage, setBgImage] = useState(defaultImage);

    useEffect(() => {
        const fetchBanner = async () => {
            const banner = await bannerService.getBanner(panelKey);
            if (banner?.image_url && banner.is_active) {
                setBgImage(banner.image_url);
            }
        };
        fetchBanner();
    }, [panelKey]);

    return (
        <div className="relative p-6 md:p-10 mb-4 overflow-hidden rounded-[2rem] shadow-sm border border-primary/10 mx-2">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Full-width banner background */}
                <img 
                    src={bgImage} 
                    alt={`Fondo ${panelKey}`} 
                    className="w-full h-full object-cover object-right"
                />
                {/* Gradient overlay to ensure text readability */}
                <div className={cn("absolute inset-0 bg-gradient-to-r", gradientClass)}></div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
                <div className="w-full max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        {title}
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                        {description}
                    </p>
                </div>
                {children && (
                    <div className="w-full">
                        {children}
                    </div>
                )}
            </div>

            {/* Andi Floating Button inside Banner */}
            {andiMessage && (
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-20">
                    <AndiGuia message={andiMessage} variant="tip" />
                </div>
            )}
        </div>
    );
};
