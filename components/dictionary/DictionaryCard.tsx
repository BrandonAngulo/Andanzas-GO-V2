import { ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { vigenciaLabel } from '../../services/dictionary.service';
import type { DictionaryEntry, DictionaryTag } from '../../types';

interface DictionaryCardProps {
  entry: DictionaryEntry;
  onOpen: (entry: DictionaryEntry) => void;
}

const tagName = (tag: DictionaryTag | string): string => typeof tag === 'string' ? tag : tag.name;

export function DictionaryCard({ entry, onOpen }: DictionaryCardProps): JSX.Element {
  const vigencia = vigenciaLabel(entry.temporal_status);
  const tags = (entry.tags ?? []) as (DictionaryTag | string)[];

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="group h-full w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        {/* Franja de acento a la izquierda */}
        <span className="absolute inset-y-0 left-0 w-1 bg-primary/70" aria-hidden />

        <header className="mb-2 flex items-start justify-between gap-3 pl-2">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-primary">{entry.term}</h3>
            {entry.word_class && <p className="mt-0.5 text-xs italic text-muted-foreground">{entry.word_class}</p>}
          </div>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
        </header>

        <p className="mb-3 line-clamp-3 pl-2 text-sm leading-relaxed text-foreground/90">
          {entry.short_definition || entry.full_definition}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pl-2">
          {vigencia && (
            <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">{vigencia}</span>
          )}
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tagName(tag)} variant="outline" className="text-[11px] font-normal">{tagName(tag)}</Badge>
          ))}
          {tags.length > 3 && <span className="text-[11px] text-muted-foreground">+{tags.length - 3}</span>}
        </div>
      </article>
    </button>
  );
}
