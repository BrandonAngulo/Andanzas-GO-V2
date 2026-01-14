import React, { useMemo } from 'react';
import { Heart, Share2, Trash2 } from 'lucide-react';
import { SITES } from '../../constants';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';

interface FavoritosPanelProps {
  ids: string[];
  query?: string;
  onOpen: (id: string) => void;
  onToggleFav: (id: string) => void;
}

const FavoritosPanel: React.FC<FavoritosPanelProps> = ({ ids, query, onOpen, onToggleFav }) => {
  const { t, language } = useI18n();

  const favs = useMemo(() => {
    let filtered = SITES.filter((s) => ids.includes(s.id));
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(s =>
        (getTranslated(s, 'nombre', language) as string).toLowerCase().includes(lowerQuery) ||
        (getTranslated(s, 'tipo', language) as string).toLowerCase().includes(lowerQuery)
      );
    }
    return filtered;
  }, [ids, query, language]);

  if (ids.length === 0) {
    return (
      <div className="h-[72vh] grid place-items-center text-center p-6">
        <div>
          <Heart className="h-8 w-8 mx-auto mb-2" />
          <p className="text-muted-foreground">{t('favorites.emptyDescription')}</p>
        </div>
      </div>
    );
  }

  if (favs.length === 0 && query) {
    return (
      <div className="h-[72vh] grid place-items-center text-center p-6">
        <p className="text-muted-foreground">No se encontraron favoritos para "{query}"</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[72vh] p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {favs.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <LazyImage
              src={s.logoUrl}
              alt={getTranslated(s, 'nombre', language) as string}
              className="w-full h-36 object-cover bg-white"
            />
            <CardHeader className="pb-1"><CardTitle className="text-base truncate" title={getTranslated(s, 'nombre', language) as string}>{getTranslated(s, 'nombre', language)}</CardTitle></CardHeader>
            <CardContent className="text-sm -mt-2 text-muted-foreground">{getTranslated(s, 'tipo', language)}</CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button size="sm" onClick={() => onOpen(s.id)}>{t('seeMore')}</Button>
              <div className="flex items-center">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => navigator?.share?.({ title: getTranslated(s, 'nombre', language) as string, text: getTranslated(s, 'descripcion', language) as string })} aria-label={t('share')}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onToggleFav(s.id)} aria-label={t('favorites.removeAria')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FavoritosPanel;