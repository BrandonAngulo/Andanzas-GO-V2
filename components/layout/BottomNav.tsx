import React from 'react';
import { Compass, TrendingUp, Route, Heart, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ActivePanelType } from '../../types';
import { useI18n } from '../../i18n';

interface IconTabProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const IconTab: React.FC<IconTabProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ease-out z-10",
          active 
            ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.6)] scale-110" 
            : "text-foreground/60 hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
        )}
        aria-label={label}
      >
        <Icon className={cn(
            "transition-all duration-300",
            active ? "h-5 w-5 stroke-[2.5px]" : "h-5 w-5 stroke-[1.5px]"
        )} />
      </button>
      
      {/* Etiqueta flotante condicional */}
      <div className={cn(
          "absolute -bottom-6 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-md border border-border/50 shadow-sm transition-all duration-300 pointer-events-none",
          active ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-1 scale-90"
      )}>
          <span className="text-[10px] font-medium whitespace-nowrap text-foreground">{label}</span>
      </div>
    </div>
  );
};

interface BottomNavProps {
    activePanel: ActivePanelType;
    setActivePanel: (panel: ActivePanelType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePanel, setActivePanel }) => {
    const { t } = useI18n();
    
    return (
        <nav className="md:hidden fixed bottom-8 inset-x-0 flex justify-center z-[45] pointer-events-none">
            {/* Contenedor principal: Fondo ultra sutil (casi invisible), solo blur y un borde muy fino */}
            <div className="pointer-events-auto flex items-center gap-4 px-4 py-2 bg-background/5 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                <IconTab 
                    icon={Compass} 
                    label={t('bottomNav.map')} 
                    active={activePanel === "mapa"} 
                    onClick={() => setActivePanel("mapa")} 
                />
                <IconTab 
                    icon={TrendingUp} 
                    label={t('bottomNav.explore')} 
                    active={activePanel === "explorar"} 
                    onClick={() => setActivePanel("explorar")} 
                />
                <IconTab 
                    icon={Route} 
                    label={t('bottomNav.routes')} 
                    active={activePanel === "rutas"} 
                    onClick={() => setActivePanel("rutas")} 
                />
                <IconTab 
                    icon={Heart} 
                    label={t('bottomNav.favs')} 
                    active={activePanel === "favoritos"} 
                    onClick={() => setActivePanel("favoritos")} 
                />
                <IconTab 
                    icon={User} 
                    label={t('bottomNav.profile')} 
                    active={activePanel === "perfil"} 
                    onClick={() => setActivePanel("perfil")} 
                />
            </div>
        </nav>
    )
}

export default BottomNav;