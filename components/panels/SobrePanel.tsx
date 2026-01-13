import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Instagram, Facebook, Globe, Heart, Sun, Map, Users } from 'lucide-react';
import { useI18n } from '../../i18n';
import Logo from '../layout/Logo';

const SobrePanel: React.FC = () => {
  const { t } = useI18n();
  return (
    <ScrollArea className="h-[72vh]">
      <div className="flex flex-col gap-6 p-4">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-muted/50 to-background rounded-2xl">
            <div className="scale-150 mb-2">
                <Logo />
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-4">v1.0.2</p>
        </div>

        <div className="grid gap-4">
            {/* Mission */}
            <Card className="border-l-4 border-l-orange-500 overflow-hidden">
                <CardContent className="p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-orange-600 dark:text-orange-400">
                        <Sun className="h-5 w-5" />
                        <span>{t('about.missionTitle')}</span>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('about.missionText')}
                    </p>
                </CardContent>
            </Card>

            {/* What Is */}
            <Card className="border-l-4 border-l-teal-600 overflow-hidden">
                <CardContent className="p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-teal-700 dark:text-teal-400">
                        <Map className="h-5 w-5" />
                        <span>{t('about.whatIsTitle')}</span>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('about.whatIsText')}
                    </p>
                </CardContent>
            </Card>

            {/* Who Is */}
            <Card className="border-l-4 border-l-blue-500 overflow-hidden">
                <CardContent className="p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">
                        <Users className="h-5 w-5" />
                        <span>{t('about.whoIsTitle')}</span>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('about.whoIsText')}
                    </p>
                </CardContent>
            </Card>
        </div>
        
        {/* Footer */}
        <section className="text-center pt-4 pb-8 space-y-4">
             <div className="flex items-center justify-center gap-2 font-medium text-sm text-muted-foreground">
                <span>{t('about.projectOf')}</span>
                <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse" />
            </div>

            <Button asChild variant="outline" className="w-full max-w-xs">
                <a href="http://www.andanzascentrocultural.com" target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    {t('about.visitWebsite')}
                </a>
            </Button>

            <div className="flex justify-center items-center gap-6">
                <a href="https://www.instagram.com/andanzas_centrocultural/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors" aria-label="Instagram">
                    <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.facebook.com/andanzascentrocultural" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors" aria-label="Facebook">
                    <Facebook className="h-6 w-6" />
                </a>
            </div>
        </section>
      </div>
    </ScrollArea>
  );
};

export default SobrePanel;