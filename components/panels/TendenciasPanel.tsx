import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { Site } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';

interface TendenciasPanelProps {
  items: Site[];
  query?: string;
  onOpenSite: (site: Site) => void;
}

const TendenciasPanel: React.FC<TendenciasPanelProps> = ({ items, query, onOpenSite }) => {
  const { t, language } = useI18n();

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(s =>
      (getTranslated(s, 'nombre', language) as string).toLowerCase().includes(lowerQuery) ||
      (getTranslated(s, 'tipo', language) as string).toLowerCase().includes(lowerQuery)
    );
  }, [items, query, language]);

  return (
    <ScrollArea className="h-[72vh] p-3">
      <div className="grid gap-3">
        {filteredItems.length === 0 && <p className="text-center text-muted-foreground p-4">No se encontraron resultados</p>}
        {filteredItems.map((s, idx) => (
          <Card key={s.id} className="group overflow-hidden border border-border/60 bg-gradient-to-br from-background via-muted/20 to-muted/40 dark:from-background dark:to-muted/10 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 flex items-center gap-6">
              <Badge variant="secondary" className="rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">{idx + 1}</Badge>
              <LazyImage
                src={s.logoUrl}
                alt={getTranslated(s, 'nombre', language) as string}
                className="h-16 w-16 object-cover rounded-lg flex-shrink-0 bg-white"
              />
              <div className="flex-1">
                <div className="font-semibold leading-tight">{getTranslated(s, 'nombre', language)}</div>
                <div className="text-sm text-muted-foreground">{getTranslated(s, 'tipo', language)} · {s.visitas} {t('rightRail.visits')}</div>
              </div>
              <div className="flex flex-col items-end gap-1 ml-auto flex-shrink-0">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {s.rating}
                </div>
                <Button size="sm" variant="outline" className="mt-1" onClick={() => onOpenSite(s)}>{t('seeMore')}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TendenciasPanel;