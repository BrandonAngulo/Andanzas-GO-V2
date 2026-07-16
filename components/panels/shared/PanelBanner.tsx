import React, { useEffect, useState } from 'react';
import { bannerService, Banner } from '../../../services/banner.service';
import { AndiGuia } from '../../shared/AndiGuia';
import { cn } from '../../../lib/utils';
import { useI18n } from '../../../i18n';

interface PanelBannerProps {
    panelKey: string;
    defaultImage: string;
    /** Icon node (usually the colored wrapper + lucide icon). */
    icon?: React.ReactNode;
    /** Title/subtitle for the current language; used when the admin has not
     *  set an override in the `app_banners` table. */
    defaultTitle: string;
    defaultSubtitle: string;
    titleClassName?: string;
    andiMessage?: string;
    gradientClass?: string;
    children?: React.ReactNode; // For extra content like CategoryCarousel
    marginClass?: string; // Margen horizontal externo; se alinea con el gutter del panel
}

export const PanelBanner: React.FC<PanelBannerProps> = ({
    panelKey,
    defaultImage,
    icon,
    defaultTitle,
    defaultSubtitle,
    titleClassName = "text-4xl font-extrabold tracking-tight text-foreground",
    andiMessage,
    gradientClass = "from-blue-50/95 via-blue-50/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 dark:to-transparent",
    children,
    marginClass = "mx-2"
}) => {
    const { language } = useI18n();
    const [bgImage, setBgImage] = useState(defaultImage);
    const [banner, setBanner] = useState<Banner | null>(null);

    useEffect(() => {
        let active = true;
        const fetchBanner = async () => {
            const data = await bannerService.getBanner(panelKey);
            if (!active) return;
            setBanner(data);
            if (data?.image_url && data.is_active) {
                setBgImage(data.image_url);
            }
        };
        fetchBanner();
        return () => { active = false; };
    }, [panelKey]);

    // Admin override (falls back to the in-code default per language).
    const overrideTitle = banner && banner.is_active
        ? (language === 'es' ? banner.title_es : (banner.title_en || banner.title_es))
        : undefined;
    const overrideSubtitle = banner && banner.is_active
        ? (language === 'es' ? banner.subtitle_es : (banner.subtitle_en || banner.subtitle_es))
        : undefined;

    const title = (overrideTitle && overrideTitle.trim()) ? overrideTitle : defaultTitle;
    const subtitle = (overrideSubtitle && overrideSubtitle.trim()) ? overrideSubtitle : defaultSubtitle;

    return (
        <div className={cn("relative p-6 md:p-10 mb-4 overflow-hidden rounded-[2rem] shadow-sm border border-primary/10", marginClass)}>
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
                        {icon}
                        <h2 className={titleClassName}>{title}</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                        {subtitle}
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
