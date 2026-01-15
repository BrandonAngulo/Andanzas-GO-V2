
import React from 'react';
import { Compass, TrendingUp, Calendar, Heart, Star, Route, User, Info, HelpCircle, LogOut, Wand2, X, ScrollText, Settings } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ActivePanelType } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  onNavigate: (id: ActivePanelType) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onClose }) => {
  const { t } = useI18n();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Potentially navigate to map or home after logout
  };

  const Item = ({ id, icon: Icon, label }: { id: ActivePanelType, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => onNavigate(id)}
      className="w-full text-left px-3 py-2 rounded-xl hover:bg-muted/60 flex items-center gap-2 transition-colors"
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold">{t('menu')}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="grid gap-1 p-0">
              <Item id="mapa" icon={Compass} label={t('panelTitles.mapa')} />
              <Item id="explorar" icon={TrendingUp} label={t('panelTitles.explorar')} />
              <Item id="noticias" icon={ScrollText} label={t('panelTitles.noticias')} />
              <Item id="eventos" icon={Calendar} label={t('panelTitles.eventos')} />
              <Item id="tendencias" icon={TrendingUp} label={t('panelTitles.tendencias')} />
              <Item id="favoritos" icon={Heart} label={t('panelTitles.favoritos')} />
              <Item id="reseñas" icon={Star} label={t('panelTitles.reseñas')} />
              <Item id="rutas" icon={Route} label={t('panelTitles.rutas')} />
              <Item id="perfil" icon={User} label={t('panelTitles.perfil')} />
              <Item id="configuracion" icon={Settings} label={t('panelTitles.configuracion')} />
              <Item id="sobre" icon={Info} label={t('panelTitles.sobre')} />
              <Item id="soporte" icon={HelpCircle} label={t('panelTitles.soporte')} />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur-sm mt-auto">
        {isAuthenticated ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> {t('logOutButton')}
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full justify-start shadow-md"
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