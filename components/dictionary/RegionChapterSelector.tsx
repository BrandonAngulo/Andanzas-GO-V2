import { Button } from '../ui/button';
import type { DictionaryRegionFacet } from '../../types';

interface RegionChapterSelectorProps {
  regions: DictionaryRegionFacet[];
  value: string;
  onChange: (slug: string) => void;
}

/** Sube por parent_slug hasta el capítulo (país) que contiene a la región dada. */
const chapterOf = (
  region: DictionaryRegionFacet | undefined,
  bySlug: Map<string, DictionaryRegionFacet>,
): DictionaryRegionFacet | undefined => {
  let current = region;
  const seen = new Set<string>();
  while (current?.parent_slug && !seen.has(current.slug)) {
    seen.add(current.slug);
    current = bySlug.get(current.parent_slug);
  }
  return current;
};

/**
 * Navegación por capítulos del diccionario: una fila de países y, al entrar en uno,
 * sus apartados (departamentos y ciudades). El filtro es recursivo en la RPC, así que
 * elegir un país trae también lo de sus departamentos y ciudades.
 */
export function RegionChapterSelector({ regions, value, onChange }: RegionChapterSelectorProps): JSX.Element | null {
  if (!regions.length) return null;

  const bySlug = new Map(regions.map((region) => [region.slug, region]));
  const countries = regions.filter((region) => region.level === 'country');
  const activeChapter = chapterOf(bySlug.get(value), bySlug);

  const areas = activeChapter
    ? regions
        .filter((region) => region.level !== 'country' && chapterOf(region, bySlug)?.slug === activeChapter.slug)
        .sort((a, b) => (a.level === b.level ? a.name.localeCompare(b.name) : a.level === 'region' ? -1 : 1))
    : [];

  const label = (region: DictionaryRegionFacet) =>
    `${region.emoji_flag ? `${region.emoji_flag} ` : ''}${region.name}${typeof region.count === 'number' ? ` (${region.count})` : ''}`;

  return (
    <div className="space-y-3">
      <div>
        <h2 className="mb-2 text-sm font-semibold">Capítulo</h2>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant={!value ? 'default' : 'outline'} onClick={() => onChange('')}>Todos</Button>
          {countries.map((country) => (
            <Button
              key={country.slug}
              size="sm"
              variant={activeChapter?.slug === country.slug ? 'default' : 'outline'}
              onClick={() => onChange(country.slug)}
              aria-pressed={activeChapter?.slug === country.slug}
            >
              {label(country)}
            </Button>
          ))}
        </div>
      </div>

      {areas.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">
            Dentro de {activeChapter?.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant={value === activeChapter?.slug ? 'default' : 'outline'}
              onClick={() => onChange(activeChapter?.slug ?? '')}
            >
              Todo el país
            </Button>
            {areas.map((area) => (
              <Button
                key={area.slug}
                size="sm"
                variant={value === area.slug ? 'default' : 'outline'}
                onClick={() => onChange(area.slug)}
                aria-pressed={value === area.slug}
                className={area.level === 'city' ? 'italic' : undefined}
              >
                {label(area)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
