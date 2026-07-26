
import React from 'react';
import { Compass, TrendingUp, Calendar, Heart, Star, Route, User, Info, HelpCircle, LogOut, Wand2, X, ScrollText, Settings, BookOpen, ShieldAlert, Handshake, Gamepad2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ActivePanelType } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onNavigate: (id: ActivePanelType) => void;
  onClose: () => void;
  activePanel: ActivePanelType;
  onOpenSupport?: () => void;
  onOpenAlliances?: () => void;
  showDictionary?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onClose, activePanel, onOpenSupport, onOpenAlliances, showDictionary = false }) => {
  const { t } = useI18n();
  const { logout, isAuthenticated, user } = useAuth();
  const { userProfile } = useUserData();

  const handleLogout = async () => {
    await logout();
  };

  const Item = ({ id, icon: Icon, label }: { id: ActivePanelType, icon: React.ElementType, label: string }) => {
    const isActive = activePanel === id;
    return (
      <button
        onClick={() => onNavigate(id)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200",
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
      <div className="flex flex-shrink-0 items-center justify-between border-b bg-background/30 px-4 py-3">
        <h3 className="font-semibold tracking-tight">{t('menu')}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2.5">
          <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider opacity-70">
            Explorar
          </div>
          <Item id="mapa" icon={Compass} label={t('panelTitles.mapa')} />
          <Item id="explorar" icon={TrendingUp} label={t('panelTitles.explorar')} />
          <Item id="eventos" icon={Calendar} label={t('panelTitles.eventos')} />
          <Item id="juegos" icon={Gamepad2} label={t('panelTitles.juegos')} />
          <Item id="paquesepas" icon={BookOpen} label={"Pa' que sepás"} />
          {showDictionary && <Item id="diccionario" icon={BookOpen} label={t('panelTitles.diccionario')} />}
          <Item id="noticias" icon={ScrollText} label={t('panelTitles.noticias')} />

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
          <Item id="tendencias" icon={TrendingUp} label={import.meta.env.VITE_ENABLE_MOCK_DATA === 'false' ? 'Recomendados' : t('panelTitles.tendencias')} />
          <Item id="configuracion" icon={Settings} label={t('panelTitles.configuracion')} />
          <Item id="soporte" icon={HelpCircle} label={t('panelTitles.soporte')} />
          <Item id="sobre" icon={Info} label={t('panelTitles.sobre') || 'Sobre Andanzas GO'} />
          {onOpenAlliances && (
            <button
              onClick={() => { onOpenAlliances(); onClose(); }}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              <Handshake className="h-4 w-4 transition-colors" />
              Alianzas
            </button>
          )}
          {onOpenSupport && (
            <button
              onClick={() => { onOpenSupport(); onClose(); }}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-pink-600 transition-all duration-200 hover:bg-pink-500/10 dark:text-pink-400"
            >
              <Heart className="h-4 w-4 fill-current transition-colors" />
              Apóyanos
            </button>
          )}
          {((userProfile?.role === 'admin' || userProfile?.role === 'editor') || user?.email?.trim().toLowerCase() === 'gruesobrandon@gmail.com' || userProfile?.email?.trim().toLowerCase() === 'gruesobrandon@gmail.com') && (
            <>
              <div className="my-2 border-t border-border/40 mx-2" />
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider opacity-70">
                Administración
              </div>
              <Item id="admin" icon={ShieldAlert} label="Panel Admin" />
            </>
          )}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t bg-background/50 p-3 backdrop-blur-sm">
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
