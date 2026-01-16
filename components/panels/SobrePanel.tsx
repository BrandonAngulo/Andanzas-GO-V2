import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Instagram, Facebook, Globe, Heart, Sun, Map, Users, Info } from 'lucide-react';
import { useI18n } from '../../i18n';
import Logo from '../layout/Logo';

const SobrePanel: React.FC = () => {
    const { t } = useI18n();
    return (
        <ScrollArea className="h-[72vh]">
            <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">

                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-muted/50 to-background rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                    <div className="scale-150 mb-4 drop-shadow-lg transition-transform hover:scale-[1.6] duration-500">
                        <Logo />
                    </div>
                    <div className="flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border shadow-sm">
                        <Info className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">v1.0.2 Public Beta</span>
                    </div>
                </div>

                <div className="grid gap-4">
                    {/* Mission */}
                    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <Sun className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">{t('about.missionTitle')}</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                {t('about.missionText')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* What Is */}
                    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-background hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                                    <Map className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">{t('about.whatIsTitle')}</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                {t('about.whatIsText')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Who Is */}
                    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">{t('about.whoIsTitle')}</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                {t('about.whoIsText')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <section className="text-center pt-6 pb-8 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <Button asChild className="w-full max-w-sm font-semibold shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none text-white h-12 rounded-xl">
                            <a href="http://www.andanzascentrocultural.com" target="_blank" rel="noopener noreferrer">
                                <Globe className="h-5 w-5 mr-2" />
                                {t('about.visitWebsite')}
                            </a>
                        </Button>

                        <div className="flex justify-center items-center gap-4">
                            <a href="https://www.instagram.com/andanzas_centrocultural/" target="_blank" rel="noopener noreferrer"
                                className="p-3 rounded-full bg-gradient-to-tr from-orange-400 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all"
                                aria-label="Instagram">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://www.facebook.com/andanzascentrocultural" target="_blank" rel="noopener noreferrer"
                                className="p-3 rounded-full bg-blue-600 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all"
                                aria-label="Facebook">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground/50 uppercase tracking-widest mt-8">
                        <span>{t('about.projectOf')}</span>
                        <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
};

export default SobrePanel;