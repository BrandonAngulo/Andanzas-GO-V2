import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { RECOMENDADOS_IDS } from '../../constants';
import { Site } from '../../types';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { ScrollArea } from '../ui/scroll-area';

interface RightRailProps {
  aiTips: boolean;
  onOpenSite: (site: Site) => void;
  sites: Site[];
}

const RightRail: React.FC<RightRailProps> = ({ aiTips, onOpenSite, sites }) => {
  const { t, language } = useI18n();
  const recomendados = sites.filter(site => RECOMENDADOS_IDS.includes(site.id));

  return (
    <div className="sticky top-[56px] space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('rightRail.smartSuggestions')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm grid gap-2">
          {aiTips ? (
            <>
              <div className="p-3 rounded-lg bg-muted" dangerouslySetInnerHTML={{ __html: t('rightRail.recommendedRoute') }} />
              <div className="p-3 rounded-lg bg-muted" dangerouslySetInnerHTML={{ __html: t('rightRail.eventSuggestion') }} />
              <div className="p-3 rounded-lg bg-muted" dangerouslySetInnerHTML={{ __html: t('rightRail.ticketSuggestion') }} />
            </>
          ) : (
            <div className="text-muted-foreground">{t('rightRail.activateAi')}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('rightRail.recommendedByAndanzas')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-3 grid gap-1 text-sm">
              {recomendados.map(site => (
                <button
                  key={site.id}
                  onClick={() => onOpenSite(site)}
                  className="flex items-start gap-3 w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <LazyImage
                    src={site.logoUrl}
                    alt={getTranslated(site, 'nombre', language) as string}
                    className="h-12 w-12 rounded object-cover flex-shrink-0 bg-white"
                  />
                  <div className="flex-1">
                    <div className="font-semibold leading-tight">{getTranslated(site, 'nombre', language)}</div>
                    <div className="text-xs text-muted-foreground">{getTranslated(site, 'tipo', language)}</div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightRail;