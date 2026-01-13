import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';
import { SITES } from '../../constants';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import StarRating from '../shared/StarRating';
import ExpandableText from '../shared/ExpandableText';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface ResenasPanelProps {
  reviews: Review[];
}

const ResenasPanel: React.FC<ResenasPanelProps> = ({ reviews }) => {
  const { t, language } = useI18n();

  if (reviews.length === 0) {
    return (
      <div className="h-[72vh] grid place-items-center text-center p-6">
        <div>
          <Star className="h-8 w-8 mx-auto mb-2" />
          <p className="text-muted-foreground">{t('reviews.emptyDescription')}</p>
        </div>
      </div>
    );
  }
  return (
    <ScrollArea className="h-[72vh] p-3">
      <div className="grid gap-3">
        {reviews.map((r) => {
          const site = SITES.find((s) => s.id === r.siteId);
          return (
            <Card key={r.id}>
              <CardHeader className="pb-2"><CardTitle className="text-base">{getTranslated(site, 'nombre', language)}</CardTitle></CardHeader>
              <CardContent className="-mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating value={r.rating} />
                  <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <ExpandableText text={r.text} max={140} />
                {r.fotos?.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {r.fotos.map((f, i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg grid place-items-center text-xs">Foto {i + 1}</div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ResenasPanel;