import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, BookOpen, Loader2, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { dictionaryService } from '../../../services/dictionary.service';
import { useFeatures } from '../../../contexts/FeatureContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import type { DictionaryAdminEntry, DictionaryTagOption } from '../../../types';
import { DictionaryEntryEditor } from './DictionaryEntryEditor';
import { BulkActionsBar } from './BulkActionsBar';

type PendingAction = 'enable' | 'disable' | 'show' | 'hide' | null;

const PAGE_SIZE = 20;

export function AdminDictionary(): JSX.Element {
  const { dictionaryFeature, refreshDictionaryFeature } = useFeatures();
  const { user } = useAuth();
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // --- Entries management ---
  const [tags, setTags] = useState<DictionaryTagOption[]>([]);
  const [entries, setEntries] = useState<DictionaryAdminEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryAdminEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<DictionaryAdminEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sel = useBulkSelection(entries);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    dictionaryService.getEntryCount().then(setEntryCount).catch(() => setEntryCount(null));
    dictionaryService.listTags().then(setTags).catch(() => setTags([]));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const loadEntries = useCallback(async (nextOffset: number, append: boolean) => {
    if (append) setLoadingMore(true); else setEntriesLoading(true);
    try {
      const result = await dictionaryService.listEntries({ query: debouncedQuery, limit: PAGE_SIZE, offset: nextOffset });
      setEntries((current) => append ? [...current, ...result.entries] : result.entries);
      setTotal(result.total);
      setOffset(nextOffset);
    } catch (error) {
      console.error('No se pudieron cargar las entradas:', error);
      if (!append) setEntries([]);
      toast.error('No se pudieron cargar las entradas del diccionario.');
    } finally {
      setEntriesLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedQuery]);

  useEffect(() => { void loadEntries(0, false); }, [loadEntries]);

  const refreshEntries = () => {
    void loadEntries(0, false);
    dictionaryService.getEntryCount().then(setEntryCount).catch(() => undefined);
  };

  const openCreate = () => { setEditingEntry(null); setEditorOpen(true); };
  const openEdit = (entry: DictionaryAdminEntry) => { setEditingEntry(entry); setEditorOpen(true); };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    setDeleting(true);
    try {
      await dictionaryService.deleteEntry(entryToDelete.id);
      toast.success('Entrada eliminada.');
      setEntryToDelete(null);
      refreshEntries();
    } catch (error) {
      console.error('No se pudo eliminar la entrada:', error);
      toast.error('No se pudo eliminar la entrada. Revisa tus permisos.');
    } finally {
      setDeleting(false);
    }
  };

  const runBulk = async (action: () => Promise<void>, okMsg: string) => {
    setBulkBusy(true);
    try {
      await action();
      toast.success(okMsg);
      refreshEntries();
      sel.clear();
    } catch (error) {
      console.error('Acción en bloque fallida:', error);
      toast.error('No se pudo completar la acción en bloque. Revisa tus permisos.');
    } finally {
      setBulkBusy(false);
    }
  };
  const bulkPublish = () => runBulk(() => dictionaryService.bulkSetStatus(sel.selectedIds, 'published', user?.id), 'Entradas publicadas.');
  const bulkUnpublish = () => runBulk(() => dictionaryService.bulkSetStatus(sel.selectedIds, 'draft', user?.id), 'Entradas pasadas a borrador.');
  const confirmBulkDelete = async () => { await runBulk(() => dictionaryService.bulkDelete(sel.selectedIds), 'Entradas eliminadas.'); setBulkDeleteOpen(false); };

  const executeAction = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      if (pendingAction === 'enable') await dictionaryService.setEnabled(true);
      if (pendingAction === 'disable') await dictionaryService.setEnabled(false);
      if (pendingAction === 'show') await dictionaryService.setMenuVisibility(true);
      if (pendingAction === 'hide') await dictionaryService.setMenuVisibility(false);
      await refreshDictionaryFeature();
      toast.success('Estado del diccionario actualizado.');
    } catch (error) {
      console.error('No se pudo actualizar el diccionario:', error);
      toast.error('No se pudo actualizar la función. Revisa tus permisos e intenta nuevamente.');
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const isEnabled = dictionaryFeature?.status === 'published' && dictionaryFeature.is_enabled;
  const confirmation = pendingAction === 'enable'
    ? { title: '¿Activar y publicar el diccionario?', description: 'Esta acción cambiará el estado a published y hará visible el Diccionario de la caleñidad en el menú público.', confirm: 'Activar y publicar' }
    : pendingAction === 'disable'
      ? { title: '¿Desactivar el diccionario?', description: 'La herramienta dejará de estar disponible para los usuarios y volverá al estado ready.', confirm: 'Desactivar' }
      : pendingAction === 'show'
        ? { title: '¿Mostrar en el menú?', description: 'La opción será visible únicamente si la función también está publicada y habilitada.', confirm: 'Mostrar' }
        : { title: '¿Ocultar del menú?', description: 'La opción dejará de aparecer en la navegación pública.', confirm: 'Ocultar' };

  return (
    <div className="space-y-6">
      <div><h2 className="flex items-center gap-2 text-2xl font-bold"><BookOpen className="h-6 w-6 text-primary" />Diccionario de la caleñidad</h2><p className="mt-1 text-muted-foreground">Controla su publicación y gestiona las entradas: crear, editar y eliminar.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Estado de la función</CardTitle><CardDescription>Clave: dictionary_caleno</CardDescription></CardHeader><CardContent className="space-y-3"><div className="flex flex-wrap gap-2"><Badge variant={dictionaryFeature?.status === 'published' ? 'default' : 'secondary'}>{dictionaryFeature?.status ?? 'no disponible'}</Badge><Badge variant={dictionaryFeature?.is_enabled ? 'default' : 'outline'}>{dictionaryFeature?.is_enabled ? 'Habilitada' : 'Deshabilitada'}</Badge><Badge variant={dictionaryFeature?.show_in_menu ? 'default' : 'outline'}>{dictionaryFeature?.show_in_menu ? 'Visible en menú' : 'Oculta del menú'}</Badge></div>{dictionaryFeature?.release_at && <p className="text-sm text-muted-foreground">Fecha de publicación: {new Date(dictionaryFeature.release_at).toLocaleString('es-CO')}</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Entradas disponibles</CardTitle><CardDescription>Contenido almacenado en Supabase</CardDescription></CardHeader><CardContent><p className="text-4xl font-bold">{entryCount ?? '—'}</p><p className="mt-2 text-sm text-muted-foreground">Gestiona el contenido en la sección de abajo.</p></CardContent></Card>
      </div>
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4"><div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" /><div><p className="font-semibold">Un solo interruptor</p><p className="text-sm text-muted-foreground">Activar publica, habilita y muestra el Diccionario en el menú en una sola acción. Desactivar lo oculta por completo. (El diccionario solo se consulta desde el menú, así que no hace falta un control separado de visibilidad.)</p></div></div></div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setPendingAction(isEnabled ? 'disable' : 'enable')} variant={isEnabled ? 'destructive' : 'default'} disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEnabled ? 'Desactivar diccionario' : 'Activar diccionario'}</Button>
      </div>

      {/* --- Gestión de entradas --- */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Entradas del diccionario</CardTitle>
              <CardDescription>Crea, edita y elimina palabras, definiciones y categorías.</CardDescription>
            </div>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Nueva entrada</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Buscar por término o definición" aria-label="Buscar entradas" />
          </div>

          {entriesLoading ? (
            <div className="flex min-h-32 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
          ) : entries.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No hay entradas que coincidan con la búsqueda.</div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{total} {total === 1 ? 'entrada' : 'entradas'}</p>
              <BulkActionsBar count={sel.count} allSelected={sel.allSelected} onToggleAll={sel.toggleAll} onClear={sel.clear} busy={bulkBusy} onActivate={bulkPublish} onDeactivate={bulkUnpublish} activateLabel="Publicar" deactivateLabel="Pasar a borrador" onDelete={() => setBulkDeleteOpen(true)} />
              <ul className="divide-y rounded-xl border">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex flex-wrap items-center gap-3 p-3">
                    <Checkbox checked={sel.isSelected(entry.id)} onChange={() => sel.toggle(entry.id)} aria-label={`Seleccionar ${entry.term}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{entry.term}</span>
                        {entry.is_featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        <Badge variant={entry.status === 'published' ? 'default' : 'secondary'} className="text-xs">{entry.status}</Badge>
                        {entry.word_class && <span className="text-xs text-muted-foreground">{entry.word_class}</span>}
                      </div>
                      {entry.short_definition && <p className="mt-0.5 truncate text-sm text-muted-foreground">{entry.short_definition}</p>}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(entry)} aria-label={`Editar ${entry.term}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setEntryToDelete(entry)} aria-label={`Eliminar ${entry.term}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
              {entries.length < total && (
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => void loadEntries(offset + PAGE_SIZE, true)} disabled={loadingMore}>{loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Cargar más</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog open={!!pendingAction} onOpenChange={(open) => { if (!open) setPendingAction(null); }} title={confirmation.title} description={confirmation.description} confirmText={confirmation.confirm} destructive={pendingAction === 'disable'} onConfirm={() => { void executeAction(); }} />

      <DictionaryEntryEditor open={editorOpen} entry={editingEntry} tags={tags} userId={user?.id} onOpenChange={setEditorOpen} onSaved={refreshEntries} />

      <ConfirmDialog
        open={!!entryToDelete}
        onOpenChange={(open) => { if (!open && !deleting) setEntryToDelete(null); }}
        title="¿Eliminar esta entrada?"
        description={entryToDelete ? `Se eliminará «${entryToDelete.term}» de forma permanente, junto con sus categorías y fuentes asociadas.` : undefined}
        confirmText="Eliminar"
        destructive
        onConfirm={() => { void confirmDelete(); }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={(open) => { if (!open && !bulkBusy) setBulkDeleteOpen(false); }}
        title={`¿Eliminar ${sel.count} entrada${sel.count === 1 ? '' : 's'}?`}
        description="Se eliminarán de forma permanente, junto con sus categorías y fuentes asociadas."
        confirmText="Eliminar"
        destructive
        onConfirm={() => { void confirmBulkDelete(); }}
      />
    </div>
  );
}
