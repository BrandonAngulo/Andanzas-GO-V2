import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { dictionaryService } from '../../services/dictionary.service';
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
    <section>
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3>
      <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
    </section>
  ) : null;

  return (
    <Dialog open={!!entry} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {entry && <>
          <DialogHeader>
            <DialogTitle className="pr-8 text-3xl text-primary">{entry.term}</DialogTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              {entry.word_class && <Badge variant="secondary">{entry.word_class}</Badge>}
              {entry.temporal_status && <Badge variant="outline">{entry.temporal_status}</Badge>}
              {entry.tags?.map((tag) => <Badge key={tagName(tag)} variant="outline">{tagName(tag)}</Badge>)}
            </div>
          </DialogHeader>
          <div className="space-y-5">
            {field('Definición completa', entry.full_definition || entry.short_definition)}
            {field('Ejemplo de uso', entry.usage_example)}
            {field('Contexto de uso', entry.usage_context)}
            {field('Alcance geográfico', entry.geographic_scope)}
            {field('Registro social', entry.social_register)}
            {field('Etimología', entry.etymology)}
            {field('Notas', entry.notes)}
            {!!entry.variants?.length && field('Variantes', entry.variants.join(', '))}
            {!!sources.length && (
              <section>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Fuentes</h3>
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
