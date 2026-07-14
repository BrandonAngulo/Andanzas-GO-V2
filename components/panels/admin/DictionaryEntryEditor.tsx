import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Textarea } from '../../ui/textarea';
import { dictionaryService, slugifyTerm } from '../../../services/dictionary.service';
import type { DictionaryAdminEntry, DictionaryEntryInput, DictionaryTagOption } from '../../../types';

interface DictionaryEntryEditorProps {
  open: boolean;
  entry: DictionaryAdminEntry | null;
  tags: DictionaryTagOption[];
  userId?: string | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const TEMPORAL_STATUSES = ['vigente', 'juvenil', 'historica', 'por_verificar'];
const PUBLICATION_STATUSES = ['draft', 'published'];

const emptyForm = (): DictionaryEntryInput => ({
  term: '',
  slug: '',
  variants: [],
  pronunciation: null,
  word_class: null,
  short_definition: null,
  full_definition: null,
  usage_example: null,
  usage_context: null,
  geographic_scope: [],
  social_register: [],
  temporal_status: 'vigente',
  etymology: null,
  notes: null,
  audio_url: null,
  image_url: null,
  status: 'draft',
  is_featured: false,
  publish_at: null,
});

const toForm = (entry: DictionaryAdminEntry): DictionaryEntryInput => ({
  term: entry.term,
  slug: entry.slug,
  variants: entry.variants ?? [],
  pronunciation: entry.pronunciation,
  word_class: entry.word_class,
  short_definition: entry.short_definition,
  full_definition: entry.full_definition,
  usage_example: entry.usage_example,
  usage_context: entry.usage_context,
  geographic_scope: entry.geographic_scope ?? [],
  social_register: entry.social_register ?? [],
  temporal_status: entry.temporal_status,
  etymology: entry.etymology,
  notes: entry.notes,
  audio_url: entry.audio_url,
  image_url: entry.image_url,
  status: entry.status,
  is_featured: entry.is_featured,
  publish_at: entry.publish_at,
});

const csvToArray = (value: string): string[] => value.split(',').map((item) => item.trim()).filter(Boolean);
const arrayToCsv = (value: string[]): string => value.join(', ');
const orNull = (value: string): string | null => { const trimmed = value.trim(); return trimmed ? trimmed : null; };
// datetime-local <-> ISO helpers
const toLocalInput = (iso: string | null): string => iso ? new Date(iso).toISOString().slice(0, 16) : '';

export function DictionaryEntryEditor({ open, entry, tags, userId, onOpenChange, onSaved }: DictionaryEntryEditorProps): JSX.Element {
  const [form, setForm] = useState<DictionaryEntryInput>(emptyForm);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEdit = !!entry;

  useEffect(() => {
    if (!open) return;
    if (entry) {
      setForm(toForm(entry));
      setSelectedTagIds(entry.tag_ids ?? []);
      setSlugTouched(true);
    } else {
      setForm(emptyForm());
      setSelectedTagIds([]);
      setSlugTouched(false);
    }
  }, [open, entry]);

  const set = <K extends keyof DictionaryEntryInput>(key: K, value: DictionaryEntryInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const onTermChange = (value: string) => {
    setForm((current) => ({
      ...current,
      term: value,
      slug: slugTouched ? current.slug : slugifyTerm(value),
    }));
  };

  const toggleTag = (id: string) =>
    setSelectedTagIds((current) => current.includes(id) ? current.filter((tagId) => tagId !== id) : [...current, id]);

  const canSave = useMemo(() => form.term.trim() && form.slug.trim(), [form.term, form.slug]);

  const handleSave = async () => {
    if (!canSave) {
      toast.error('El término y el slug son obligatorios.');
      return;
    }
    const payload: DictionaryEntryInput = {
      ...form,
      term: form.term.trim(),
      slug: slugifyTerm(form.slug) || slugifyTerm(form.term),
      publish_at: form.publish_at ? new Date(form.publish_at).toISOString() : null,
    };
    setSaving(true);
    try {
      if (isEdit && entry) {
        await dictionaryService.updateEntry(entry.id, payload, selectedTagIds, userId);
        toast.success('Entrada actualizada.');
      } else {
        await dictionaryService.createEntry(payload, selectedTagIds, userId);
        toast.success('Entrada creada.');
      }
      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      console.error('No se pudo guardar la entrada:', error);
      const message = error?.code === '23505'
        ? 'Ya existe una entrada con ese slug. Usa uno distinto.'
        : 'No se pudo guardar la entrada. Revisa los datos y tus permisos.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const labelClass = 'mb-1 block text-sm font-medium';
  const textField = (label: string, key: keyof DictionaryEntryInput, placeholder?: string) => (
    <div>
      <label className={labelClass}>{label}</label>
      <Input value={(form[key] as string) ?? ''} placeholder={placeholder} onChange={(event) => set(key, orNull(event.target.value) as any)} />
    </div>
  );
  const areaField = (label: string, key: keyof DictionaryEntryInput, placeholder?: string) => (
    <div>
      <label className={labelClass}>{label}</label>
      <Textarea value={(form[key] as string) ?? ''} placeholder={placeholder} onChange={(event) => set(key, orNull(event.target.value) as any)} />
    </div>
  );
  const csvField = (label: string, key: 'variants' | 'geographic_scope' | 'social_register', placeholder: string) => (
    <div>
      <label className={labelClass}>{label}</label>
      <Input value={arrayToCsv(form[key])} placeholder={placeholder} onChange={(event) => set(key, csvToArray(event.target.value))} />
      <p className="mt-1 text-xs text-muted-foreground">Separa varios valores con comas.</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar entrada' : 'Nueva entrada'}</DialogTitle>
          <DialogDescription>Diccionario de la caleñidad · los cambios se guardan en Supabase.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Término *</label>
              <Input value={form.term} onChange={(event) => onTermChange(event.target.value)} placeholder="Ej. ¡Ave María!" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <Input value={form.slug} onChange={(event) => { setSlugTouched(true); set('slug', event.target.value); }} placeholder="ave-maria" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Clase de palabra</label>
              <Input value={form.word_class ?? ''} onChange={(event) => set('word_class', orNull(event.target.value))} placeholder="sustantivo, interjección…" />
            </div>
            <div>
              <label className={labelClass}>Vigencia</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.temporal_status}
                onChange={(event) => set('temporal_status', event.target.value)}
              >
                {TEMPORAL_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.status}
                onChange={(event) => set('status', event.target.value)}
              >
                {PUBLICATION_STATUSES.map((value) => <option key={value} value={value}>{value === 'published' ? 'published (visible)' : 'draft (borrador)'}</option>)}
              </select>
            </div>
          </div>

          {areaField('Definición corta', 'short_definition', 'Resumen breve que aparece en las tarjetas.')}
          {areaField('Definición completa', 'full_definition')}
          {areaField('Ejemplo de uso', 'usage_example')}
          {areaField('Contexto de uso', 'usage_context')}

          <div className="grid gap-4 md:grid-cols-2">
            {csvField('Variantes', 'variants', 'avemaría, ave maría')}
            {textField('Pronunciación', 'pronunciation', '[aβemaˈɾia]')}
            {csvField('Alcance geográfico', 'geographic_scope', 'Cali, Valle del Cauca')}
            {csvField('Registro social', 'social_register', 'coloquial, familiar')}
          </div>

          {areaField('Etimología', 'etymology')}
          {areaField('Notas', 'notes')}

          <div className="grid gap-4 md:grid-cols-2">
            {textField('URL de imagen', 'image_url', 'https://…')}
            {textField('URL de audio', 'audio_url', 'https://…')}
          </div>

          <div>
            <label className={labelClass}>Categorías</label>
            {tags.length === 0
              ? <p className="text-sm text-muted-foreground">No hay categorías disponibles.</p>
              : <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const active = selectedTagIds.includes(tag.id);
                    return (
                      <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}>
                        <Badge variant={active ? 'default' : 'outline'} className="cursor-pointer">{tag.label}</Badge>
                      </button>
                    );
                  })}
                </div>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Publicar a partir de (opcional)</label>
              <Input type="datetime-local" value={toLocalInput(form.publish_at)} onChange={(event) => set('publish_at', event.target.value || null)} />
            </div>
            <div className="flex items-end gap-3">
              <Switch checked={form.is_featured} onChange={(event) => set('is_featured', event.target.checked)} />
              <span className="text-sm font-medium">Entrada destacada</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={() => void handleSave()} disabled={saving || !canSave}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Guardar cambios' : 'Crear entrada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
