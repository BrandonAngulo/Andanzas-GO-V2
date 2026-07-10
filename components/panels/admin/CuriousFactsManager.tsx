import React, { useState, useEffect } from 'react';
import { CuriousFact } from '../../../types';
import { curiositiesService } from '../../../services/curiosities.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Plus, Edit2, Trash2, Eye, CalendarClock, Archive, Search } from 'lucide-react';
import { CuriousFactForm } from './CuriousFactForm';
import { Dialog, DialogContent } from '../../ui/dialog';
import { ConfirmDialog } from '../../ui/confirm-dialog';

export const CuriousFactsManager = () => {
    const [facts, setFacts] = useState<CuriousFact[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingFact, setEditingFact] = useState<CuriousFact | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadFacts();
    }, []);

    const loadFacts = async () => {
        setLoading(true);
        const data = await curiositiesService.getAllAdmin();
        setFacts(data);
        setLoading(false);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await curiositiesService.deleteCuriosity(deleteId);
            loadFacts();
            setDeleteId(null);
        }
    };

    const handleSave = async (factData: Partial<CuriousFact>) => {
        if (editingFact?.id) {
            await curiositiesService.updateCuriosity(editingFact.id, factData);
        } else {
            await curiositiesService.createCuriosity(factData as Omit<CuriousFact, 'id' | 'created_at' | 'updated_at'>);
        }
        setIsFormOpen(false);
        setEditingFact(undefined);
        loadFacts();
    };

    const handleAddNew = () => {
        setEditingFact(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (fact: CuriousFact) => {
        setEditingFact(fact);
        setIsFormOpen(true);
    };

    const filteredFacts = facts.filter(f => 
        (f.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'published': return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Publicado</span>;
            case 'ready': return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Listo</span>;
            case 'scheduled': return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Programado</span>;
            case 'review': return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Revisión</span>;
            case 'archived': return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Archivado</span>;
            default: return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Borrador</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por texto, título o ciudad..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {!isFormOpen && (
                    <Button onClick={handleAddNew} className="rounded-full shadow-sm whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Dato Curioso
                    </Button>
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setEditingFact(undefined);
            }}>
                <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none [&>button]:hidden">
                    <CuriousFactForm 
                        fact={editingFact} 
                        onSave={handleSave} 
                        onCancel={() => { setIsFormOpen(false); setEditingFact(undefined); }} 
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Estás seguro de eliminar este dato curioso?"
                description="Esta acción no se puede deshacer."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />

            {!isFormOpen && loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando datos curiosos...</div>
            ) : !isFormOpen && (
                <div className="grid gap-4">
                    {filteredFacts.map(fact => (
                        <Card key={fact.id} className="overflow-hidden border-l-4 border-l-emerald-500">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusBadge(fact.status)}
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{fact.category} • {fact.city}</span>
                                            {fact.show_as_notification && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded-sm ml-2">Notif</span>}
                                            {fact.show_in_pa_que_sepas && <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded-sm">Pa' que sepás</span>}
                                            {fact.related_game_id && <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded-sm">Trivia</span>}
                                        </div>
                                        <h4 className="font-semibold text-base">{fact.title || 'Dato sin título'}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{fact.text}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(fact)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(fact.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredFacts.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron datos curiosos.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
