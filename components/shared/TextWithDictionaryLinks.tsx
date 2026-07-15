import React from 'react';
import type { DictionaryEntry } from '../../types';

interface TextWithDictionaryLinksProps {
  text: string;
  entries: DictionaryEntry[];
  onOpen: (entry: DictionaryEntry) => void;
  /** Clases para el término enlazado (por defecto, subrayado punteado). */
  linkClassName?: string;
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Resalta en un texto los términos del Diccionario de la caleñidad (y sus variantes)
 * y los convierte en enlaces que abren la ficha correspondiente. Enlaza solo la primera
 * aparición de cada término para no saturar. No modifica el texto si no hay coincidencias.
 */
export const TextWithDictionaryLinks: React.FC<TextWithDictionaryLinksProps> = ({ text, entries, onOpen, linkClassName }) => {
  if (!text) return null;
  if (!entries || entries.length === 0) return <>{text}</>;

  // Cada matcher: término (o variante) -> entrada. Ordenados por longitud desc para
  // priorizar frases largas sobre subcadenas.
  const matchers: { keyword: string; entry: DictionaryEntry }[] = [];
  for (const entry of entries) {
    const forms = [entry.term, ...((entry.variants as string[] | undefined) ?? [])].filter(Boolean) as string[];
    for (const form of forms) {
      const kw = form.trim();
      if (kw.length >= 3) matchers.push({ keyword: kw, entry });
    }
  }
  matchers.sort((a, b) => b.keyword.length - a.keyword.length);

  const linkedEntryIds = new Set<string>();
  let elements: (React.ReactNode | string)[] = [text];

  for (const { keyword, entry } of matchers) {
    if (linkedEntryIds.has(entry.id)) continue;
    const regex = new RegExp(`(?<![\\p{L}])(${escapeRegExp(keyword)})(?![\\p{L}])`, 'iu');
    let linkedThis = false;
    const next: (React.ReactNode | string)[] = [];

    for (const el of elements) {
      if (linkedThis || typeof el !== 'string') { next.push(el); continue; }
      const match = regex.exec(el);
      if (!match) { next.push(el); continue; }
      const start = match.index;
      const end = start + match[0].length;
      if (start > 0) next.push(el.slice(0, start));
      next.push(
        <span
          key={`${entry.id}-${start}`}
          role="button"
          tabIndex={0}
          className={linkClassName || 'cursor-pointer font-semibold text-primary underline decoration-dotted underline-offset-2'}
          onClick={(e) => { e.stopPropagation(); onOpen(entry); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(entry); } }}
          title={`Ver en el diccionario: ${entry.term}`}
        >
          {match[0]}
        </span>
      );
      if (end < el.length) next.push(el.slice(end));
      linkedThis = true;
      linkedEntryIds.add(entry.id);
    }
    elements = next;
  }

  return <>{elements}</>;
};
