import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import { Megaphone, Loader2 } from 'lucide-react';
import { notificationsService } from '../../../services/notifications.service';

interface BroadcastModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTitle?: string;
    defaultMessage?: string;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ 
    open, 
    onOpenChange, 
    defaultTitle = '¡Novedad en Andanzas GO!', 
    defaultMessage = '' 
}) => {
    const [title, setTitle] = useState(defaultTitle);
    const [message, setMessage] = useState(defaultMessage);
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error('El título y el mensaje son obligatorios.');
            return;
        }

        setSending(true);
        try {
            await notificationsService.broadcastMessage(title, message);
            toast.success('¡Notificación enviada a todos los usuarios!');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al enviar la notificación.');
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-primary" />
                        Notificar a Usuarios
                    </DialogTitle>
                    <DialogDescription>
                        Envía una notificación push a todos los usuarios de la aplicación. Usa esto para anunciar la activación de nuevas campañas, rutas o eventos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Título de la Alerta</label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej. ¡Nueva campaña activada!"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Mensaje de la Alerta</label>
                        <Textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Detalles sobre lo que acabas de activar..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>Cancelar</Button>
                    <Button onClick={handleSend} disabled={sending}>
                        {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Megaphone className="w-4 h-4 mr-2" />}
                        Enviar Alerta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
