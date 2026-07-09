import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Settings, Users, BookOpen, Map, Landmark, Calendar, Newspaper, BarChart2 } from 'lucide-react';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';

interface AdminIntroModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminIntroModal: React.FC<AdminIntroModalProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 bg-muted/30 border-b">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Guía del Panel de Administración
                    </DialogTitle>
                    <DialogDescription>
                        Este panel centraliza todas las herramientas de gestión de Andanzas GO. Descubre para qué sirve cada sección.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] p-6">
                    <div className="space-y-6">
                        <Section 
                            icon={<BarChart2 className="w-5 h-5 text-blue-500" />} 
                            title="Métricas y Analytics" 
                            desc="Visualiza estadísticas globales del sistema: número de usuarios activos, rutas completadas, eventos populares y datos de interacción." 
                        />
                        <Section 
                            icon={<Map className="w-5 h-5 text-green-500" />} 
                            title="Gestión de Rutas" 
                            desc="Crea, edita o elimina rutas temáticas. Puedes configurar recorridos libres o con cupos limitados e inscripción previa. Asigna narrativas y reglas de gamificación." 
                        />
                        <Section 
                            icon={<Landmark className="w-5 h-5 text-amber-500" />} 
                            title="Gestión de Sitios" 
                            desc="Administra el catálogo de sitios turísticos y culturales. Sube imágenes, ajusta información histórica y geolocalización." 
                        />
                        <Section 
                            icon={<Calendar className="w-5 h-5 text-red-500" />} 
                            title="Gestión de Eventos" 
                            desc="Programa eventos y actividades. Define fechas, lugares y cupos disponibles para que los usuarios participen." 
                        />
                        <Section 
                            icon={<BookOpen className="w-5 h-5 text-purple-500" />} 
                            title="¿Sabías Qué? (Curiosidades)" 
                            desc="Agrega datos curiosos y píldoras de historia que aparecerán de forma aleatoria a lo largo de la experiencia de los usuarios en la app." 
                        />
                        <Section 
                            icon={<Newspaper className="w-5 h-5 text-orange-500" />} 
                            title="Noticias y 'Pa que sepas'" 
                            desc="Publica artículos, novedades o información relevante ('Pa que sepas') para mantener informada a la comunidad." 
                        />
                        <Section 
                            icon={<Users className="w-5 h-5 text-indigo-500" />} 
                            title="Gestión de Usuarios" 
                            desc="Supervisa la lista de usuarios registrados, visualiza sus perfiles, roles y actividad reciente dentro de la aplicación." 
                        />
                        
                        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-sm text-foreground/90 mt-4">
                            <strong>Nota importante:</strong> Los cambios realizados en este panel (publicar rutas, editar sitios, agregar eventos) se reflejan inmediatamente en la aplicación principal (en tiempo real o al recargar la pantalla según la vista). Asegúrate de validar el contenido antes de cambiar su estado a "Publicado".
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-muted/10 flex justify-end">
                    <Button onClick={onClose}>Entendido</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const Section = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex gap-4 p-4 border rounded-xl bg-card hover:bg-muted/30 transition-colors shadow-sm">
        <div className="mt-1 shrink-0 p-2 bg-muted rounded-full w-10 h-10 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-base mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    </div>
);
