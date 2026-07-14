import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { DictionaryEntry, DictionaryTag } from '../../types';

interface DictionaryCardProps {
  entry: DictionaryEntry;
  onOpen: (entry: DictionaryEntry) => void;
}

const tagName = (tag: DictionaryTag | string): string => typeof tag === 'string' ? tag : tag.name;

export function DictionaryCard({ entry, onOpen }: DictionaryCardProps): JSX.Element {
  return (
    <button type="button" onClick={() => onOpen(entry)} className="h-full w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl text-primary">{entry.term}</CardTitle>
            {entry.temporal_status && <Badge variant="secondary">{entry.temporal_status}</Badge>}
          </div>
          {entry.word_class && <p className="text-sm italic text-muted-foreground">{entry.word_class}</p>}
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="leading-relaxed">{entry.short_definition || entry.full_definition}</p>
          {!!entry.variants?.length && <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Variantes:</span> {entry.variants.join(', ')}</p>}
          {!!entry.tags?.length && (
            <div className="flex flex-wrap gap-1.5" aria-label="Etiquetas">
              {entry.tags.map((tag) => <Badge key={tagName(tag)} variant="outline">{tagName(tag)}</Badge>)}
            </div>
          )}
        </CardContent>
      </Card>
    </button>
  );
}
