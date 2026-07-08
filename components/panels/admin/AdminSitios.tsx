import React, { useState, useEffect } from 'react';
import { Site } from '../../../types';
import { sitesService } from '../../../services/sites.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Eye, EyeOff, Search, Trash2 } from 'lucide-react';

export const AdminSitios = () => {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        setLoading(true);
        const data = await sitesService.getAllAdmin();
        setSites(data);
        setLoading(false);
    };

    const handleTogglePublish = async (site: Site) => {
        const newStatus = site.status === 'published' ? 'draft' : 'published';
        await sitesService.update(site.id, { status: newStatus });
        loadSites();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este sitio? Esta acción no se puede deshacer.')) {
            await sitesService.delete(id);
            loadSites();
        }
    };

    const filteredSites = sites.filter(s => s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || s.tipo?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar sitio por nombre o tipo..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando sitios...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredSites.map(site => (
                        <Card key={site.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${site.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {site.status === 'published' ? 'Publicado' : 'Oculto'}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{site.tipo}</span>
                                        </div>
                                        <h4 className="font-semibold text-base">{site.nombre}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{site.descripcion}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleTogglePublish(site)}
                                            className={site.status === 'published' ? 'text-green-600' : 'text-muted-foreground'}
                                            title={site.status === 'published' ? "Ocultar sitio" : "Publicar sitio"}
                                        >
                                            {site.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(site.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredSites.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron sitios.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
