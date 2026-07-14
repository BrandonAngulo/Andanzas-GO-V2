import React, { useState, useEffect } from 'react';
import { Game, gamesService } from '../../../services/games.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Plus, Edit2, Trash2, Gamepad2, Globe, Lock, Search, PlayCircle, BarChart3, List } from 'lucide-react';
import { JuegoForm } from './JuegoForm';
import { JuegosAnalyticsPanel } from './JuegosAnalyticsPanel';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Checkbox } from '../../ui/checkbox';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import { BulkActionsBar } from './BulkActionsBar';

export const AdminJuegos = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [currentGame, setCurrentGame] = useState<Game | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        setLoading(true);
        const data = await gamesService.getAllGames();
        setGames(data);
        setLoading(false);
    };

    const handleSave = async (gameData: Partial<Game>) => {
        if (currentGame?.id) {
            await gamesService.updateGame(currentGame.id, gameData);
        } else {
            await gamesService.createGame(gameData);
        }
        setIsFormOpen(false);
        setCurrentGame(undefined);
        loadGames();
    };

    const handleAddNew = () => {
        setCurrentGame(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (game: Game) => {
        setCurrentGame(game);
        setIsFormOpen(true);
    };

    const handleStatusToggle = async (game: Game) => {
        const newStatus = game.status === 'published' ? 'draft' : 'published';
        await gamesService.updateGame(game.id, { status: newStatus });
        loadGames();
    };

    const filteredGames = games.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sel = useBulkSelection(filteredGames);
    const [bulkBusy, setBulkBusy] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const runBulk = async (fn: (id: string) => Promise<any>) => {
        setBulkBusy(true);
        try { await Promise.all(sel.selectedIds.map(fn)); await loadGames(); sel.clear(); }
        finally { setBulkBusy(false); }
    };
    const bulkPublish = () => runBulk(id => gamesService.updateGame(id, { status: 'published' }));
    const bulkUnpublish = () => runBulk(id => gamesService.updateGame(id, { status: 'draft' }));
    const confirmBulkDelete = async () => { await runBulk(id => gamesService.deleteGame(id)); setBulkDeleteOpen(false); };
    const confirmDelete = async () => { if (deleteId) { await gamesService.deleteGame(deleteId); await loadGames(); setDeleteId(null); } };

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Eliminar este juego?"
                description="Esta acción no se puede deshacer."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={(open) => !open && setBulkDeleteOpen(false)}
                title={`¿Eliminar ${sel.count} juego${sel.count === 1 ? '' : 's'}?`}
                description="Esta acción no se puede deshacer."
                onConfirm={confirmBulkDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar juego..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {!isFormOpen && !showAnalytics && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowAnalytics(true)} className="rounded-full shadow-sm whitespace-nowrap">
                            <BarChart3 className="w-4 h-4 mr-2" /> Analíticas
                        </Button>
                        <Button onClick={handleAddNew} className="rounded-full shadow-sm whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" /> Nuevo Juego
                        </Button>
                    </div>
                )}
                {showAnalytics && (
                    <Button variant="outline" onClick={() => setShowAnalytics(false)} className="rounded-full shadow-sm whitespace-nowrap">
                        <List className="w-4 h-4 mr-2" /> Ver Juegos
                    </Button>
                )}
            </div>

            {showAnalytics && !isFormOpen && (
                <div className="animate-in fade-in duration-300">
                    <JuegosAnalyticsPanel />
                </div>
            )}

            {isFormOpen && (
                <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
                    <JuegoForm 
                        game={currentGame} 
                        onSave={handleSave} 
                        onCancel={() => { setIsFormOpen(false); setCurrentGame(undefined); }} 
                    />
                </div>
            )}

            {!isFormOpen && !showAnalytics && loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando juegos...</div>
            ) : !isFormOpen && !showAnalytics ? (
                <div className="grid gap-4">
                    {filteredGames.length > 0 && (
                        <BulkActionsBar count={sel.count} allSelected={sel.allSelected} onToggleAll={sel.toggleAll} onClear={sel.clear} busy={bulkBusy} onActivate={bulkPublish} onDeactivate={bulkUnpublish} activateLabel="Publicar" deactivateLabel="Ocultar" onDelete={() => setBulkDeleteOpen(true)} />
                    )}
                    {filteredGames.map(game => (
                        <Card key={game.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex items-start p-4 pb-0 sm:items-center sm:p-6 sm:pr-0">
                                        <Checkbox checked={sel.isSelected(game.id)} onChange={() => sel.toggle(game.id)} aria-label={`Seleccionar ${game.title}`} />
                                    </div>
                                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                game.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {game.status === 'published' ? 'Publicado' : 'Borrador'}
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                                {game.type}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-1">{game.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {game.description || 'Sin descripción'}
                                        </p>
                                        <div className="flex items-center text-xs text-muted-foreground gap-4">
                                            <span className="flex items-center gap-1">
                                                <Gamepad2 className="w-3.5 h-3.5" />
                                                Dificultad: {game.difficulty_level}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-muted/50 p-4 sm:w-48 flex sm:flex-col justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-border">
                                        <Button variant="outline" size="sm" className="w-full justify-center bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" onClick={() => window.dispatchEvent(new CustomEvent('open-game', { detail: { gameId: game.id } }))}>
                                            <PlayCircle className="w-4 h-4 sm:mr-2" />
                                            <span className="hidden sm:inline">Probar</span>
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => handleEdit(game)}>
                                            <Edit2 className="w-4 h-4 sm:mr-2" />
                                            <span className="hidden sm:inline">Editar</span>
                                        </Button>
                                        <Button 
                                            variant={game.status === 'published' ? "secondary" : "default"} 
                                            size="sm" 
                                            className="w-full justify-center"
                                            onClick={() => handleStatusToggle(game)}
                                        >
                                            {game.status === 'published' ? (
                                                <><Lock className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Ocultar</span></>
                                            ) : (
                                                <><Globe className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Publicar</span></>
                                            )}
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full justify-center text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(game.id)}>
                                            <Trash2 className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Eliminar</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredGames.length === 0 && !isFormOpen && (
                        <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                            No hay juegos creados.
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};
