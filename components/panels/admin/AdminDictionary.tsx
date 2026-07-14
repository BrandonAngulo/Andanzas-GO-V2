import { useEffect, useState } from 'react';
import { AlertTriangle, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { dictionaryService } from '../../../services/dictionary.service';
import { useFeatures } from '../../../contexts/FeatureContext';

type PendingAction = 'enable' | 'disable' | 'show' | 'hide' | null;

export function AdminDictionary(): JSX.Element {
  const { dictionaryFeature, refreshDictionaryFeature } = useFeatures();
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    dictionaryService.getEntryCount().then(setEntryCount).catch(() => setEntryCount(null));
  }, []);

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
      <div><h2 className="flex items-center gap-2 text-2xl font-bold"><BookOpen className="h-6 w-6 text-primary" />Diccionario de la caleñidad</h2><p className="mt-1 text-muted-foreground">Controla su publicación sin modificar entradas, conceptos ni definiciones.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Estado de la función</CardTitle><CardDescription>Clave: dictionary_caleno</CardDescription></CardHeader><CardContent className="space-y-3"><div className="flex flex-wrap gap-2"><Badge variant={dictionaryFeature?.status === 'published' ? 'default' : 'secondary'}>{dictionaryFeature?.status ?? 'no disponible'}</Badge><Badge variant={dictionaryFeature?.is_enabled ? 'default' : 'outline'}>{dictionaryFeature?.is_enabled ? 'Habilitada' : 'Deshabilitada'}</Badge><Badge variant={dictionaryFeature?.show_in_menu ? 'default' : 'outline'}>{dictionaryFeature?.show_in_menu ? 'Visible en menú' : 'Oculta del menú'}</Badge></div>{dictionaryFeature?.release_at && <p className="text-sm text-muted-foreground">Fecha de publicación: {new Date(dictionaryFeature.release_at).toLocaleString('es-CO')}</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Entradas disponibles</CardTitle><CardDescription>Contenido almacenado en Supabase</CardDescription></CardHeader><CardContent><p className="text-4xl font-bold">{entryCount ?? '—'}</p><p className="mt-2 text-sm text-muted-foreground">Esta administración no elimina ni edita entradas.</p></CardContent></Card>
      </div>
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4"><div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" /><div><p className="font-semibold">Activar hará visible el diccionario</p><p className="text-sm text-muted-foreground">La activación publica, habilita y muestra la herramienta en el menú en una sola acción.</p></div></div></div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setPendingAction(isEnabled ? 'disable' : 'enable')} variant={isEnabled ? 'destructive' : 'default'} disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEnabled ? 'Desactivar' : 'Activar y publicar'}</Button>
        <Button onClick={() => setPendingAction(dictionaryFeature?.show_in_menu ? 'hide' : 'show')} variant="outline" disabled={loading || !dictionaryFeature}>{dictionaryFeature?.show_in_menu ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}{dictionaryFeature?.show_in_menu ? 'Ocultar del menú' : 'Mostrar en el menú'}</Button>
      </div>
      <ConfirmDialog open={!!pendingAction} onOpenChange={(open) => { if (!open) setPendingAction(null); }} title={confirmation.title} description={confirmation.description} confirmText={confirmation.confirm} destructive={pendingAction === 'disable'} onConfirm={() => { void executeAction(); }} />
    </div>
  );
}
