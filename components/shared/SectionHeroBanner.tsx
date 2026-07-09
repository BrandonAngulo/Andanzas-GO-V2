import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeroBannerProps {
  title: string;
  subtitle?: string;
  illustrationUrl?: string;
  illustrationAlt?: string;
  colorTheme?: 'primary' | 'secondary' | 'accent' | 'muted' | 'gradient';
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeroBanner: React.FC<SectionHeroBannerProps> = ({
  title,
  subtitle,
  illustrationUrl,
  illustrationAlt = "Ilustración de la sección",
  colorTheme = 'primary',
  className,
  children
}) => {
  const themeStyles = {
    primary: 'bg-primary/10 text-primary-foreground',
    secondary: 'bg-secondary/20 text-secondary-foreground',
    accent: 'bg-accent/20 text-accent-foreground',
    muted: 'bg-muted text-muted-foreground',
    gradient: 'bg-gradient-to-br from-primary/20 via-background to-secondary/20'
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-6 mb-8 flex flex-col justify-center min-h-[160px]", themeStyles[colorTheme], className)}>
      {/* Background illustration if provided */}
      {illustrationUrl && (
        <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-1/2 opacity-30 md:opacity-50 pointer-events-none flex justify-end">
          <img 
            src={illustrationUrl} 
            alt={illustrationAlt} 
            className="h-full object-cover object-right mix-blend-multiply"
          />
        </div>
      )}
      
      <div className="relative z-10 max-w-[70%]">
        <h1 className="text-2xl md:text-3xl font-black text-foreground drop-shadow-sm mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-foreground/80 font-medium text-sm md:text-base max-w-md">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
