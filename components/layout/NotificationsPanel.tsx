import React from 'react';
import { Notificacion } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';
import { Bell, Activity, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface NotificationsPanelProps {
  notifications: Notificacion[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenNews?: () => void;
}

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "a";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
}


const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onOpenNews }) => {
  const { t, language } = useI18n();

  return (
    <Card className="absolute top-12 right-0 w-80 md:w-96 z-[1200] shadow-2xl">
      <Tabs defaultValue="alertas" className="w-full">
        <CardHeader className="p-3 pb-0 border-b">
          <TabsList className="w-full grid grid-cols-2 bg-muted/50 h-9">
            <TabsTrigger value="alertas" className="text-xs font-semibold">
              <Bell className="w-3.5 h-3.5 mr-2" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="noticias" className="text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 mr-2" />
              Noticias
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-0">
          <TabsContent value="alertas" className="m-0 border-none">
            <div className="flex justify-between items-center p-3 pb-1 border-b bg-muted/20">
              <span className="text-sm font-semibold">{t('notifications.title')}</span>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={onMarkAllAsRead}>
                {t('notifications.markAllAsRead')}
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
          <div className="p-2 space-y-1">
            {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">{t('notifications.noNotifications')}</p>}
            {notifications.map(n => {
              const Icon = n.icono || Bell;
              return (
                <div key={n.id} className={cn("flex items-start gap-3 p-2 rounded-lg relative", !n.leida ? "bg-secondary" : "")}>
                  {!n.leida && <div className="absolute top-2 left-2 h-2 w-2 rounded-full bg-primary" />}
                   <div className="mt-1 flex-shrink-0">
                     <Icon className="h-5 w-5 text-muted-foreground" />
                   </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{getTranslated(n, 'titulo', language)}</p>
                    <p className="text-xs text-muted-foreground">{getTranslated(n, 'descripcion', language)}</p>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">{timeSince(new Date(n.fecha))}</div>
                   {!n.leida && (
                     <Button variant="ghost" size="sm" className="p-0 h-auto text-xs" onClick={() => onMarkAsRead(n.id)}>{t('notifications.read')}</Button>
                   )}
                </div>
              );
            })}
          </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="noticias" className="m-0 p-6 flex flex-col items-center justify-center text-center h-[340px] bg-muted/10">
            <Activity className="h-12 w-12 text-primary/30 mb-4" />
            <h4 className="font-bold mb-2">El Pulso de la Ciudad</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Descubre reseñas de usuarios, anuncios oficiales y novedades en tiempo real.
            </p>
            <Button className="w-full rounded-xl" onClick={onOpenNews}>
              Ver todas las noticias <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default NotificationsPanel;