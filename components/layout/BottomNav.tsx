import React from 'react';
import { Compass, Sparkles, Route, Heart, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ActivePanelType } from '../../types';
import { useI18n } from '../../i18n';

interface IconTabProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function IconTab({ icon: Icon, label, active, onClick }: IconTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 transition-colors',
        active
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
      )}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className={cn('h-5 w-5 transition-transform', active && 'scale-105 stroke-[2.5px]')} />
      <span className="w-full truncate text-center text-[10px] font-bold leading-none">{label}</span>
    </button>
  );
}

interface BottomNavProps {
    activePanel: ActivePanelType;
    setActivePanel: (panel: ActivePanelType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePanel, setActivePanel }) => {
    const { t } = useI18n();
    
    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-[45] border-t border-border/70 bg-background/95 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_35px_-25px_rgba(15,23,42,0.7)] backdrop-blur-xl md:hidden"
            aria-label="Navegación principal"
        >
            <div className="mx-auto flex max-w-lg items-stretch gap-1">
                <IconTab 
                    icon={Compass} 
                    label={t('bottomNav.map')} 
                    active={activePanel === "mapa"} 
                    onClick={() => setActivePanel("mapa")} 
                />
                <IconTab 
                    icon={Sparkles}
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
