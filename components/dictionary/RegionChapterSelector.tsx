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
 * sus apartados. El filtro es recursivo en la RPC, así que elegir un país trae también
 * lo de sus departamentos y ciudades.
 *
 * Para evitar redundancia mostramos los departamentos solo cuando hay más de uno; si el
 * capítulo tiene un único departamento saltamos directo a sus ciudades.
 */
export function RegionChapterSelector({ regions, value, onChange }: RegionChapterSelectorProps): JSX.Element | null {
  const countries = regions.filter((region) => region.level === 'country');
  if (!countries.length) return null;

  const bySlug = new Map(regions.map((region) => [region.slug, region]));
  const activeChapter = chapterOf(bySlug.get(value), bySlug);

  const inChapter = activeChapter
    ? regions.filter((region) => region.level !== 'country' && chapterOf(region, bySlug)?.slug === activeChapter.slug)
    : [];
  const departments = inChapter.filter((region) => region.level === 'region');
  const cities = inChapter.filter((region) => region.level === 'city');
  // Departamentos solo aportan si hay varios; con uno, sus ciudades ya cuentan la historia.
  const areas = (departments.length > 1 ? departments : cities).sort((a, b) => a.name.localeCompare(b.name));

  const count = (region: DictionaryRegionFacet) =>
    typeof region.count === 'number' ? ` · ${region.count}` : '';

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-2 flex items-baseline gap-2">
          <h2 className="text-sm font-semibold">Capítulo</h2>
          <span className="text-xs text-muted-foreground">explora por territorio</span>
        </div>
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
              {country.name}{count(country)}
            </Button>
          ))}
        </div>
      </div>

      {activeChapter && areas.length > 0 && (
        <div className="rounded-xl bg-muted/40 p-3">
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">
            Dentro de {activeChapter.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant={value === activeChapter.slug ? 'default' : 'outline'}
              onClick={() => onChange(activeChapter.slug)}
            >
              Todo el capítulo
            </Button>
            {areas.map((area) => (
              <Button
                key={area.slug}
                size="sm"
                variant={value === area.slug ? 'default' : 'outline'}
                onClick={() => onChange(area.slug)}
                aria-pressed={value === area.slug}
              >
                {area.name}{count(area)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
