import React, { useState, useEffect } from 'react';
import { FeedItem } from '../../../types';
import { newsService } from '../../../services/news.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Eye, EyeOff, Search, Trash2, Edit, Plus } from 'lucide-react';
import { NoticiaForm } from './NoticiaForm';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Checkbox } from '../../ui/checkbox';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import { BulkActionsBar } from './BulkActionsBar';

export const AdminNoticias = () => {
    const [news, setNews] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        setLoading(true);
        const data = await newsService.getAllAdmin();
        setNews(data);
        setLoading(false);
    };

    const handleTogglePublish = async (item: FeedItem) => {
        const newStatus = item.status === 'published' ? 'draft' : 'published';
        await newsService.update(item.id, { status: newStatus });
        loadNews();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await newsService.delete(deleteId);
            loadNews();
            setDeleteId(null);
        }
    };

    const filteredNews = news.filter(n => (n.titulo || '').toLowerCase().includes(searchQuery.toLowerCase()) || (n.contenido || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const sel = useBulkSelection(filteredNews);
    const [bulkBusy, setBulkBusy] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const runBulk = async (fn: (id: string) => Promise<any>) => {
        setBulkBusy(true);
        try { await Promise.all(sel.selectedIds.map(fn)); await loadNews(); sel.clear(); }
        finally { setBulkBusy(false); }
    };
    const bulkPublish = () => runBulk(id => newsService.update(id, { status: 'published' }));
    const bulkUnpublish = () => runBulk(id => newsService.update(id, { status: 'draft' }));
    const confirmBulkDelete = async () => { await runBulk(id => newsService.delete(id)); setBulkDeleteOpen(false); };

    const handleOpenCreate = () => {
        setEditingNewsId(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (id: string) => {
        setEditingNewsId(id);
        setIsFormOpen(true);
    };

    const handleFormSaved = () => {
        setIsFormOpen(false);
        loadNews();
    };

    if (isFormOpen) {
        return <NoticiaForm itemId={editingNewsId} onClose={() => setIsFormOpen(false)} onSaved={handleFormSaved} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar noticia..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Noticia
                </Button>
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Eliminar esta noticia?"
                description="Esta acción no se puede deshacer."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={(open) => !open && setBulkDeleteOpen(false)}
                title={`¿Eliminar ${sel.count} noticia${sel.count === 1 ? '' : 's'}?`}
                description="Esta acción no se puede deshacer."
                onConfirm={confirmBulkDelete}
                destructive={true}
                confirmText="Eliminar"
            />

            {!loading && filteredNews.length > 0 && (
                <BulkActionsBar count={sel.count} allSelected={sel.allSelected} onToggleAll={sel.toggleAll} onClear={sel.clear} busy={bulkBusy} onActivate={bulkPublish} onDeactivate={bulkUnpublish} activateLabel="Publicar" deactivateLabel="Ocultar" onDelete={() => setBulkDeleteOpen(true)} />
            )}

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando noticias...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredNews.map(item => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <Checkbox className="mt-1 self-start sm:mt-0 sm:self-center" checked={sel.isSelected(item.id)} onChange={() => sel.toggle(item.id)} aria-label={`Seleccionar ${item.titulo || 'noticia'}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {item.status === 'published' ? 'Publicada' : 'Oculta'}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.type}</span>
                                        </div>
                                        <h4 className="font-semibold text-base">{item.titulo || 'Sin título'}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{item.contenido}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleTogglePublish(item)}
                                            className={item.status === 'published' ? 'text-green-600' : 'text-muted-foreground'}
                                            title={item.status === 'published' ? "Ocultar noticia" : "Publicar noticia"}
                                        >
                                            {item.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item.id)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredNews.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron noticias.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
