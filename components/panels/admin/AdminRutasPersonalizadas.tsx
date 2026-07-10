import React, { useState, useEffect } from 'react';
import { CustomRouteRequest } from '../../../types';
import { customRoutesService } from '../../../services/customRoutes.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Map, Mail, Users, CheckCircle2, XCircle, Clock, Save, FileText, Search } from 'lucide-react';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';

export const AdminRutasPersonalizadas: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const loadRequests = async () => {
        setLoading(true);
        const data = await customRoutesService.getAllAdmin();
        setRequests(data);
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        await customRoutesService.updateStatus(id, status);
        setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    };

    const handleUpdateDetails = async (id: string, details: string) => {
        await customRoutesService.updateDetails(id, details);
        // Alert o feedback sutil podría ir aquí
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pendiente</span>;
            case 'reviewed': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Search className="w-3 h-3" /> En Revisión</span>;
            case 'contacted': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Mail className="w-3 h-3" /> Contactado</span>;
            case 'accepted': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Aceptada</span>;
            case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Rechazada</span>;
            default: return null;
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
        const searchStr = searchQuery.toLowerCase();
        const matchesSearch = 
            (r.profile?.nombre || '').toLowerCase().includes(searchStr) ||
            (r.profile?.email || '').toLowerCase().includes(searchStr) ||
            (r.category || '').toLowerCase().includes(searchStr) ||
            (r.group_type || '').toLowerCase().includes(searchStr);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 pb-24 min-h-[85vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Map className="w-6 h-6 text-primary" /> Solicitudes de Rutas
                    </h3>
                    <p className="text-muted-foreground text-sm">Gestiona las peticiones de rutas personalizadas hechas por los usuarios.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar usuario o plan..." 
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="pending">Pendientes</SelectItem>
                            <SelectItem value="reviewed">En Revisión</SelectItem>
                            <SelectItem value="contacted">Contactados</SelectItem>
                            <SelectItem value="accepted">Aceptadas</SelectItem>
                            <SelectItem value="rejected">Rechazadas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 animate-pulse">Cargando solicitudes...</div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                    No se encontraron solicitudes.
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredRequests.map(req => (
                        <Card key={req.id} className="overflow-hidden border shadow-sm">
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="p-4 bg-muted/30 border-b flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden shrink-0 flex items-center justify-center">
                                            {req.profile?.avatar_url ? (
                                                <img src={req.profile.avatar_url} alt={req.profile.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-primary">{req.profile?.nombre?.charAt(0) || 'U'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base leading-tight">{req.profile?.nombre || 'Usuario Desconocido'}</h4>
                                            <p className="text-xs text-muted-foreground">{req.profile?.email || 'Sin correo'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {getStatusBadge(req.status)}
                                        <p className="text-[10px] text-muted-foreground text-right mt-1">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="p-4 grid grid-cols-2 gap-4 text-sm flex-grow">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Categoría</p>
                                        <p className="font-medium">{req.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Tipo de Grupo</p>
                                        <p className="font-medium flex items-center gap-1"><Users className="w-3 h-3" /> {req.group_type} ({req.group_size} pers.)</p>
                                    </div>
                                    
                                    {req.themes && req.themes.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-muted-foreground text-xs mb-1">Temáticas de Interés</p>
                                            <div className="flex gap-1 flex-wrap">
                                                {req.themes.map((t: string) => (
                                                    <span key={t} className="bg-secondary/50 border px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {req.cultural_approach && req.cultural_approach.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-muted-foreground text-xs mb-1">Aproximación Cultural</p>
                                            <div className="flex gap-1 flex-wrap">
                                                {req.cultural_approach.map((t: string) => (
                                                    <span key={t} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-muted/10 border-t space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold flex items-center gap-1"><FileText className="w-3 h-3"/> Notas Administrativas</label>
                                        <div className="flex gap-2">
                                            <Textarea 
                                                defaultValue={req.details || ''}
                                                className="text-xs min-h-[60px]"
                                                placeholder="Añade notas sobre el contacto con el usuario, cotizaciones, etc..."
                                                onBlur={(e) => handleUpdateDetails(req.id, e.target.value)}
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground text-right">Se guarda al salir del cuadro</p>
                                    </div>

                                    <div className="flex items-center gap-2 justify-between pt-2 border-t">
                                        <span className="text-xs font-medium">Cambiar estado:</span>
                                        <Select value={req.status} onValueChange={(v) => handleUpdateStatus(req.id, v)}>
                                            <SelectTrigger className="h-8 text-xs w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pendiente</SelectItem>
                                                <SelectItem value="reviewed">En Revisión</SelectItem>
                                                <SelectItem value="contacted">Contactado</SelectItem>
                                                <SelectItem value="accepted">Aceptada</SelectItem>
                                                <SelectItem value="rejected">Rechazada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
