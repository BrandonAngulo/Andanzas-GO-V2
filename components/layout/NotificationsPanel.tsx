import React from 'react';
import { Notificacion } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import { Bell } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface NotificationsPanelProps {
  notifications: Notificacion[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
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


const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const { t, language } = useI18n();

  return (
    <Card className="absolute top-12 right-0 w-80 z-[1200] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{t('notifications.title')}</CardTitle>
        <Button variant="link" size="sm" className="p-0 h-auto" onClick={onMarkAllAsRead}>{t('notifications.markAllAsRead')}</Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
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
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;