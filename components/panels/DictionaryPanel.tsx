import { useEffect, useState } from 'react';
import { AlertCircle, BookOpen, Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { DictionaryCard } from '../dictionary/DictionaryCard';
import { DictionaryDetail } from '../dictionary/DictionaryDetail';
import { RegionChapterSelector } from '../dictionary/RegionChapterSelector';
import { WordOfTheDayCard } from '../dictionary/WordOfTheDayCard';
import { dictionaryService } from '../../services/dictionary.service';
import type { DictionaryEntry, DictionaryFacets } from '../../types';

const EMPTY_FACETS: DictionaryFacets = { letters: [], tags: [], temporalStatuses: [], regions: [] };
const PAGE_SIZE = 24;

export function DictionaryPanel(): JSX.Element {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [letter, setLetter] = useState('');
  const [tag, setTag] = useState('');
  const [temporalStatus, setTemporalStatus] = useState('');
  const [regionSlug, setRegionSlug] = useState('');
  const [showAllCats, setShowAllCats] = useState(false);
  const CATS_COLLAPSED = 12;
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [facets, setFacets] = useState<DictionaryFacets>(EMPTY_FACETS);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Las letras, categorías y vigencias se recalculan dentro del capítulo activo.
  useEffect(() => {
    dictionaryService.getFacets(regionSlug).then(setFacets).catch((cause) => console.error('No se pudieron cargar los filtros:', cause));
  }, [regionSlug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setOffset(0);
    dictionaryService.search({ query: debouncedQuery, letter, tag, temporalStatus, regionSlug, limit: PAGE_SIZE, offset: 0 })
      .then(({ entries: nextEntries, total: nextTotal }) => { if (active) { setEntries(nextEntries); setTotal(nextTotal); } })
      .catch(() => { if (active) { setEntries([]); setTotal(0); setError('No pudimos consultar el diccionario. Intenta nuevamente.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [debouncedQuery, letter, tag, temporalStatus, regionSlug]);

  /** Al cambiar de capítulo, limpia letra y categoría: pueden no existir en el nuevo alcance. */
  const changeRegion = (slug: string) => {
    setRegionSlug(slug);
    setLetter('');
    setTag('');
  };

  const loadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      const result = await dictionaryService.search({ query: debouncedQuery, letter, tag, temporalStatus, regionSlug, limit: PAGE_SIZE, offset: nextOffset });
      setEntries((current) => [...current, ...result.entries]);
      setTotal(result.total);
      setOffset(nextOffset);
    } catch {
      setError('No pudimos cargar más resultados. Intenta nuevamente.');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <ScrollArea className="h-full">
    <div className="mx-auto w-full max-w-6xl space-y-6 p-1 pb-20 md:p-4 md:pb-20">
      <header className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3"><BookOpen className="h-8 w-8 text-primary" /><h1 className="text-3xl font-bold tracking-tight">Diccionario de jergas y culturas</h1></div>
        <p className="mt-2 text-muted-foreground">Palabras que cuentan cómo hablamos, vivimos y recordamos. Un capítulo por territorio.</p>
        <div className="relative mt-5" role="search">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Buscar una palabra o definición" aria-label="Buscar en el diccionario" />
        </div>
      </header>

      <WordOfTheDayCard onOpen={setSelectedEntry} />

      <section className="space-y-4 rounded-2xl border bg-card p-4" aria-label="Filtros del diccionario">
        <RegionChapterSelector regions={facets.regions} value={regionSlug} onChange={changeRegion} />
        {!!facets.regions.length && <div className="border-t" />}
        <div><h2 className="mb-2 text-sm font-semibold">Letra inicial</h2><div className="flex flex-wrap gap-1.5"><Button size="sm" variant={!letter ? 'default' : 'outline'} onClick={() => setLetter('')}>Todas</Button>{facets.letters.map((item) => <Button key={item.value} size="sm" variant={letter === item.value ? 'default' : 'outline'} onClick={() => setLetter(item.value)} aria-pressed={letter === item.value}>{item.value}</Button>)}</div></div>
        {!!facets.tags.length && <div>
          <h2 className="mb-2 text-sm font-semibold">Categoría</h2>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant={!tag ? 'default' : 'outline'} onClick={() => setTag('')}>Todas</Button>
            {(showAllCats ? facets.tags : facets.tags.slice(0, CATS_COLLAPSED)).map((item) => <Button key={item.slug || item.name} size="sm" variant={tag === (item.slug || item.name) ? 'default' : 'outline'} onClick={() => setTag(item.slug || item.name)} aria-pressed={tag === (item.slug || item.name)}>{item.name}{typeof item.count === 'number' ? ` (${item.count})` : ''}</Button>)}
            {facets.tags.length > CATS_COLLAPSED && (
              <Button size="sm" variant="ghost" className="text-primary" onClick={() => setShowAllCats((v) => !v)}>
                {showAllCats ? 'Ver menos' : `Ver todas (+${facets.tags.length - CATS_COLLAPSED})`}
              </Button>
            )}
          </div>
        </div>}
      </section>

      <p className="text-sm text-muted-foreground" aria-live="polite">{loading ? 'Consultando palabras…' : `${total} ${total === 1 ? 'resultado' : 'resultados'}`}</p>
      {loading && <div className="flex min-h-48 items-center justify-center" role="status"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="sr-only">Cargando diccionario</span></div>}
      {!loading && error && <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive" role="alert"><AlertCircle className="mb-2 h-8 w-8" /><p>{error}</p></div>}
      {!loading && !error && entries.length === 0 && <div className="min-h-40 rounded-xl border border-dashed p-10 text-center"><BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" /><h2 className="font-semibold">No encontramos palabras</h2><p className="mt-1 text-sm text-muted-foreground">Prueba con otra búsqueda o limpia los filtros.</p></div>}
      {!loading && entries.length > 0 && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{entries.map((entry) => <DictionaryCard key={entry.id} entry={entry} onOpen={setSelectedEntry} />)}</div>}
      {!loading && entries.length < total && <div className="flex justify-center"><Button onClick={loadMore} disabled={loadingMore}>{loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Cargar más</Button></div>}
      <DictionaryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
    </ScrollArea>
  );
}
