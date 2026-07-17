import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { dictionaryService, joinScope, vigenciaLabel } from '../../services/dictionary.service';
import type { DictionaryEntry, DictionarySource, DictionaryTag } from '../../types';

interface DictionaryDetailProps {
  entry: DictionaryEntry | null;
  onClose: () => void;
}

const tagName = (tag: DictionaryTag | string): string => typeof tag === 'string' ? tag : tag.name;

export function DictionaryDetail({ entry, onClose }: DictionaryDetailProps): JSX.Element {
  const [sources, setSources] = useState<DictionarySource[]>([]);

  useEffect(() => {
    let active = true;
    setSources(entry?.sources ?? []);
    if (entry && !entry.sources) {
      dictionaryService.getSources(entry.id).then((value) => { if (active) setSources(value); }).catch(() => { if (active) setSources([]); });
    }
    return () => { active = false; };
  }, [entry]);

  const field = (label: string, value?: string | null) => value ? (
    <section className="rounded-2xl border bg-muted/20 p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{label}</h3>
      <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{value}</p>
    </section>
  ) : null;

  return (
    <Dialog open={!!entry} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto overflow-x-hidden p-0">
        {entry && <>
          <DialogHeader className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white">
            <div className="pointer-events-none absolute -right-5 -top-16 font-serif text-[12rem] font-black text-white/5" aria-hidden="true">{entry.term.charAt(0)}</div>
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">Diccionario de la caleñidad</p>
            <DialogTitle className="relative pr-8 font-serif text-4xl font-black text-white">{entry.term}</DialogTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              {entry.word_class && <Badge className="border-white/20 bg-white/15 text-white">{entry.word_class}</Badge>}
              {vigenciaLabel(entry.temporal_status) && (
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">{vigenciaLabel(entry.temporal_status)}</span>
              )}
              {entry.tags?.map((tag) => <Badge key={tagName(tag)} variant="outline">{tagName(tag)}</Badge>)}
            </div>
          </DialogHeader>
          <div className="grid gap-4 p-6 md:grid-cols-2">
            {field('Definición completa', entry.full_definition || entry.short_definition)}
            {field('Ejemplo de uso', entry.usage_example)}
            {field('Contexto de uso', entry.usage_context)}
            {field('Alcance geográfico', joinScope(entry.geographic_scope))}
            {field('Registro social', joinScope(entry.social_register))}
            {field('Etimología', entry.etymology)}
            {field('Notas', entry.notes)}
            {!!entry.variants?.length && field('Variantes', entry.variants.join(', '))}
            {!!sources.length && (
              <section className="rounded-2xl border bg-primary/5 p-4 md:col-span-2">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Fuentes</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {sources.map((source, index) => {
                    const label = source.citation || source.title || source.name || source.author || source.author_or_organization || 'Fuente documental';
                    return <li key={source.id ?? `${label}-${index}`}>{source.url ? <a className="text-primary underline underline-offset-2" href={source.url} target="_blank" rel="noreferrer">{label}</a> : label}</li>;
                  })}
                </ul>
              </section>
            )}
          </div>
        </>}
      </DialogContent>
    </Dialog>
  );
}
