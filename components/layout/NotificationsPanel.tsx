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
  onNotificationClick?: (notification: Notificacion) => void;
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


const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onOpenNews, onNotificationClick }) => {
  const { t, language } = useI18n();

  // Agrupa por Hoy / Ayer / Anteriores para una lectura más clara.
  const groups = React.useMemo(() => {
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday); startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const buckets: { hoy: Notificacion[]; ayer: Notificacion[]; anteriores: Notificacion[] } = { hoy: [], ayer: [], anteriores: [] };
    notifications.forEach(n => {
      const d = new Date(n.fecha);
      if (d >= startOfToday) buckets.hoy.push(n);
      else if (d >= startOfYesterday) buckets.ayer.push(n);
      else buckets.anteriores.push(n);
    });
    return buckets;
  }, [notifications]);

  const groupLabels: Record<'hoy' | 'ayer' | 'anteriores', string> = {
    hoy: language === 'es' ? 'Hoy' : 'Today',
    ayer: language === 'es' ? 'Ayer' : 'Yesterday',
    anteriores: language === 'es' ? 'Anteriores' : 'Earlier',
  };

  const renderItem = (n: Notificacion) => {
    const Icon = n.icono || Bell;
    return (
      <div
        key={n.id}
        className={cn("flex items-start gap-3 p-2 rounded-lg relative", !n.leida ? "bg-secondary" : "", onNotificationClick ? "cursor-pointer hover:bg-muted/80" : "")}
        onClick={() => {
          if (!n.leida) onMarkAsRead(n.id);
          if (onNotificationClick) onNotificationClick(n);
        }}
      >
        {!n.leida && <div className="absolute top-2 left-2 h-2 w-2 rounded-full bg-primary" />}
        <div className="mt-1 flex-shrink-0">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 pointer-events-none">
          <p className="text-sm font-medium leading-tight">{getTranslated(n, 'titulo', language)}</p>
          <p className="text-xs text-muted-foreground">{getTranslated(n, 'descripcion', language)}</p>
        </div>
        <div className="text-xs text-muted-foreground flex-shrink-0 pointer-events-none">{timeSince(new Date(n.fecha))}</div>
        {!n.leida && (
          <Button variant="ghost" size="sm" className="p-0 h-auto text-xs z-10 relative" onClick={(e) => { e.stopPropagation(); onMarkAsRead(n.id); }}>{t('notifications.read')}</Button>
        )}
      </div>
    );
  };

  return (
    <Card className="fixed left-2 right-2 top-14 z-[1200] max-h-[calc(100dvh-5rem)] overflow-hidden shadow-2xl md:absolute md:left-auto md:right-0 md:top-12 md:w-96">
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
          <div className="p-2 space-y-2">
            {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">{t('notifications.noNotifications')}</p>}
            {(['hoy', 'ayer', 'anteriores'] as const).map(key => groups[key].length > 0 && (
              <div key={key}>
                <p className="px-2 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">{groupLabels[key]}</p>
                <div className="space-y-1">{groups[key].map(renderItem)}</div>
              </div>
            ))}
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
