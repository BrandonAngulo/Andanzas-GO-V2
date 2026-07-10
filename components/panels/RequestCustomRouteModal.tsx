import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../hooks/useAuth';
import { customRoutesService } from '../../services/customRoutes.service';
import { CustomRouteRequest } from '../../types';
import { Compass, CheckCircle2, AlertCircle } from 'lucide-react';

interface RequestCustomRouteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const RequestCustomRouteModal: React.FC<RequestCustomRouteModalProps> = ({ open, onOpenChange }) => {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        route_category: '',
        cultural_approach: '',
        group_type: '',
        group_size: '',
        preferred_date: '',
        additional_notes: ''
    });

    const resetForm = () => {
        setFormData({
            route_category: '',
            cultural_approach: '',
            group_type: '',
            group_size: '',
            preferred_date: '',
            additional_notes: ''
        });
        setSuccess(false);
        setError('');
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setTimeout(resetForm, 300);
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Debes iniciar sesión para solicitar una ruta.");
            return;
        }

        setSubmitting(true);
        setError('');
        
        try {
            const requestPayload: Omit<CustomRouteRequest, 'id' | 'created_at' | 'status'> = {
                user_id: user.id,
                route_category: formData.route_category,
                cultural_approach: formData.cultural_approach,
                group_type: formData.group_type,
                group_size: parseInt(formData.group_size, 10),
                preferred_date: formData.preferred_date ? new Date(formData.preferred_date).toISOString() : undefined,
                additional_notes: formData.additional_notes || undefined,
            };

            await customRoutesService.createRequest(requestPayload);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al enviar la solicitud.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Compass className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Solicitar Ruta Personalizada</DialogTitle>
                    <DialogDescription className="text-center">
                        Diseñamos una experiencia guiada exclusiva para ti y tu grupo por las calles de Cali.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in" />
                        <h3 className="text-lg font-bold text-emerald-700">¡Solicitud Enviada!</h3>
                        <p className="text-muted-foreground text-sm">
                            El equipo de Andanzas revisará tu solicitud y se pondrá en contacto contigo pronto para definir los detalles y enviarte una cotización.
                        </p>
                        <Button className="mt-4" onClick={() => handleOpenChange(false)}>Entendido</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}
                        
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Categoría de la Ruta *</label>
                            <Select required value={formData.route_category} onValueChange={(val) => setFormData(p => ({ ...p, route_category: val }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la categoría principal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Histórica">Histórica</SelectItem>
                                    <SelectItem value="Naturaleza y Ecología">Naturaleza y Ecología</SelectItem>
                                    <SelectItem value="Gastronomía">Gastronomía</SelectItem>
                                    <SelectItem value="Mitos y Leyendas">Mitos y Leyendas</SelectItem>
                                    <SelectItem value="Arte y Arquitectura">Arte y Arquitectura</SelectItem>
                                    <SelectItem value="Vida Nocturna">Vida Nocturna / Salsa</SelectItem>
                                    <SelectItem value="Multitemática">Multitemática (Mixta)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Aproximación Cultural *</label>
                            <Select required value={formData.cultural_approach} onValueChange={(val) => setFormData(p => ({ ...p, cultural_approach: val }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Ej. Música, Literatura, Arquitectura..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Música y Danza">Música y Danza</SelectItem>
                                    <SelectItem value="Literatura y Poesía">Literatura y Poesía</SelectItem>
                                    <SelectItem value="Arte Urbano">Arte Urbano (Graffiti)</SelectItem>
                                    <SelectItem value="Arquitectura">Arquitectura</SelectItem>
                                    <SelectItem value="Religioso">Religioso / Espiritual</SelectItem>
                                    <SelectItem value="General">General (Un poco de todo)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Plan (Tipo de Grupo) *</label>
                                <Select required value={formData.group_type} onValueChange={(val) => setFormData(p => ({ ...p, group_type: val }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo de plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Parejas">Plan Parejas</SelectItem>
                                        <SelectItem value="Familia">Plan Familia</SelectItem>
                                        <SelectItem value="Amigos">Plan Amigos</SelectItem>
                                        <SelectItem value="Institucional">Institucional / Empresa</SelectItem>
                                        <SelectItem value="Turistas">Turistas Internacionales</SelectItem>
                                        <SelectItem value="Colegio">Colegio / Universidad</SelectItem>
                                        <SelectItem value="Solo">Viajero Solitario</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Tamaño del Grupo *</label>
                                <Input 
                                    type="number" 
                                    required 
                                    min="1" 
                                    placeholder="Ej. 5"
                                    value={formData.group_size}
                                    onChange={(e) => setFormData(p => ({ ...p, group_size: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Fecha Propuesta (Opcional)</label>
                            <Input 
                                type="date" 
                                value={formData.preferred_date}
                                onChange={(e) => setFormData(p => ({ ...p, preferred_date: e.target.value }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Detalles o Peticiones Especiales (Opcional)</label>
                            <Textarea 
                                placeholder="Ej. Nos gustaría incluir una cata de café o evitar calles muy empinadas." 
                                value={formData.additional_notes}
                                onChange={(e) => setFormData(p => ({ ...p, additional_notes: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Enviando...' : 'Solicitar Cotización'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};
