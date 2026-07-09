import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { routesService } from '../../../services/routes.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Input } from '../../ui/input';
// Assuming table is not available, use basic HTML table or remove import. Actually I'll use basic HTML table.
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Download, Plus, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

interface AdminRutaInscripcionesProps {
    rutaId: string;
    rutaNombre: string;
    onClose: () => void;
}

export const AdminRutaInscripciones: React.FC<AdminRutaInscripcionesProps> = ({ rutaId, rutaNombre, onClose }) => {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, confirmed: 0, waitlist: 0 });

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const data = await routesService.getRegistrations(rutaId);
            setRegistrations(data);
            setStats({
                total: data.length,
                confirmed: data.filter(d => d.status === 'confirmed').length,
                waitlist: data.filter(d => d.status === 'waitlist').length
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, [rutaId]);

    const handleCancelRegistration = async (userId: string) => {
        if (confirm('¿Estás seguro de cancelar esta inscripción?')) {
            await routesService.cancelRegistration(rutaId, userId);
            fetchRegistrations();
        }
    };

    const handleExportCSV = () => {
        if (registrations.length === 0) return;
        const headers = "Nombre,Email,Estado,Fecha de Registro\n";
        const csv = registrations.map(r => 
            `"${r.profiles?.full_name || 'Desconocido'}","${r.profiles?.email || 'No email'}","${r.status}","${new Date(r.created_at).toLocaleString()}"`
        ).join("\n");
        const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `inscripciones_${rutaNombre.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="max-w-5xl mx-auto border shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft className="h-5 w-5" /></Button>
                        <div>
                            <CardTitle className="text-xl">Inscripciones: {rutaNombre}</CardTitle>
                            <CardDescription>Gestión de usuarios registrados a esta ruta</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchRegistrations}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualizar
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
                            <Download className="h-4 w-4 mr-2" /> Exportar CSV
                        </Button>
                        {/* Future manual add button can go here */}
                    </div>
                </div>
                
                <div className="flex gap-4 mt-4 text-sm">
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                        Total Inscritos: {stats.total}
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full font-medium">
                        Confirmados: {stats.confirmed}
                    </div>
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full font-medium">
                        En lista de espera: {stats.waitlist}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-10 text-center text-muted-foreground">Cargando inscripciones...</div>
                ) : registrations.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground border-b border-dashed mx-6 my-6 rounded-lg bg-muted/5">
                        No hay inscripciones para esta ruta todavía.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 font-medium">Usuario</th>
                                <th className="p-3 font-medium">Email</th>
                                <th className="p-3 font-medium">Estado</th>
                                <th className="p-3 font-medium">Fecha</th>
                                <th className="p-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {registrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-muted/20">
                                    <td className="p-3 font-medium">{reg.profiles?.full_name || 'Desconocido'}</td>
                                    <td className="p-3 text-muted-foreground">{reg.profiles?.email}</td>
                                    <td className="p-3">
                                        <Badge variant={reg.status === 'confirmed' ? 'default' : 'secondary'}>
                                            {reg.status === 'confirmed' ? 'Confirmado' : reg.status}
                                        </Badge>
                                    </td>
                                    <td className="p-3 text-sm text-muted-foreground">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-right">
                                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleCancelRegistration(reg.profiles?.id)}>
                                            <XCircle className="h-4 w-4 mr-1" /> Cancelar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
};
