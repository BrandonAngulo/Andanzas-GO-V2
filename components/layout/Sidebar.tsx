
import React from 'react';
import { Compass, TrendingUp, Calendar, Heart, Star, Route, User, Info, HelpCircle, LogOut, Wand2, X, ScrollText, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { ActivePanelType } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onNavigate: (id: ActivePanelType) => void;
  onClose: () => void;
  activePanel: ActivePanelType;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onClose, activePanel }) => {
  const { t } = useI18n();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const Item = ({ id, icon: Icon, label }: { id: ActivePanelType, icon: React.ElementType, label: string }) => {
    const isActive = activePanel === id;
    return (
      <button
        onClick={() => onNavigate(id)}
        className={cn(
          "w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 group",
          isActive
            ? "bg-primary/10 text-primary font-semibold shadow-sm"
            : "hover:bg-muted/80 text-foreground/80 hover:text-foreground"
        )}
      >
        <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-background/30">
        <h3 className="font-semibold tracking-tight">{t('menu')}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-3">
          <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider opacity-70">
            Explorar
          </div>
          <Item id="mapa" icon={Compass} label={t('panelTitles.mapa')} />
          <Item id="explorar" icon={TrendingUp} label={t('panelTitles.explorar')} />
          <Item id="noticias" icon={ScrollText} label={t('panelTitles.noticias')} />
          <Item id="eventos" icon={Calendar} label={t('panelTitles.eventos')} />

          <div className="my-2 border-t border-border/40 mx-2" />
          <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider opacity-70">
            Personal
          </div>
          <Item id="rutas" icon={Route} label={t('panelTitles.rutas')} />
          <Item id="favoritos" icon={Heart} label={t('panelTitles.favoritos')} />
          <Item id="reseñas" icon={Star} label={t('panelTitles.reseñas')} />
          <Item id="perfil" icon={User} label={t('panelTitles.perfil')} />

          <div className="my-2 border-t border-border/40 mx-2" />
          <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider opacity-70">
            App
          </div>
          <Item id="tendencias" icon={TrendingUp} label={t('panelTitles.tendencias')} />
          <Item id="configuracion" icon={Settings} label={t('panelTitles.configuracion')} />
          <Item id="sobre" icon={Info} label={t('panelTitles.sobre')} />
          <Item id="soporte" icon={HelpCircle} label={t('panelTitles.soporte')} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur-sm mt-auto">
        {isAuthenticated ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> {t('logOutButton')}
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full justify-start shadow-md rounded-xl"
            onClick={() => onNavigate('perfil')}
          >
            <User className="h-4 w-4 mr-2" /> {t('loginTitle') || "Iniciar Sesión"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;