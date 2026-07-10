import React, { useState, useEffect } from 'react';
import { LearnEntry } from '../../../types';
import { learningService } from '../../../services/learning.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Search } from 'lucide-react';
import { CuriosidadForm } from './CuriosidadForm';
import { Dialog, DialogContent } from '../../ui/dialog';
import { ConfirmDialog } from '../../ui/confirm-dialog';

export const AdminCuriosidades = () => {
    const [entries, setEntries] = useState<LearnEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<LearnEntry | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        setLoading(true);
        const data = await learningService.getAll();
        setEntries(data);
        setLoading(false);
    };

    const handleStatusToggle = async (entry: LearnEntry) => {
        const newStatus = entry.status === 'published' ? 'draft' : 'published';
        await learningService.update(entry.id, { status: newStatus });
        loadEntries();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await learningService.delete(deleteId);
            loadEntries();
            setDeleteId(null);
        }
    };

    const handleSave = async (entryData: Partial<LearnEntry>) => {
        if (currentEntry?.id) {
            await learningService.update(currentEntry.id, entryData);
        } else {
            await learningService.create(entryData as any);
        }
        setIsFormOpen(false);
        setCurrentEntry(undefined);
        loadEntries();
    };

    const handleAddNew = () => {
        setCurrentEntry(undefined);
        setIsFormOpen(false); // To force re-render if it was already open
        setTimeout(() => setIsFormOpen(true), 0);
    };

    const handleEdit = (entry: LearnEntry) => {
        setCurrentEntry(entry);
        setIsFormOpen(true);
    };

    const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar curiosidad o ciudad..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {!isFormOpen && (
                    <Button onClick={handleAddNew} className="rounded-full shadow-sm whitespace-nowrap">
                        <Plus className="w-4 h-4 mr-2" /> Nueva Curiosidad
                    </Button>
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setCurrentEntry(undefined);
            }}>
                <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none [&>button]:hidden">
                    <CuriosidadForm 
                        entry={currentEntry} 
                        onSave={handleSave} 
                        onCancel={() => { setIsFormOpen(false); setCurrentEntry(undefined); }} 
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Estás seguro de eliminar esta curiosidad?"
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />

            {!isFormOpen && loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando curiosidades...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredEntries.map(entry => (
                        <Card key={entry.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entry.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {entry.status === 'published' ? 'Publicado' : 'Borrador'}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{entry.city}</span>
                                        </div>
                                        <h4 className="font-semibold text-base">{entry.title}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{entry.content_full || entry.content_simple}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleStatusToggle(entry)}
                                            className={entry.status === 'published' ? 'text-green-600' : 'text-muted-foreground'}
                                        >
                                            {entry.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(entry.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredEntries.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron curiosidades.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
