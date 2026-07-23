import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Instagram, Facebook, Globe, Heart, Sun, Map, Users, Info, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import Logo from '../layout/Logo';
import { institutionalService } from '../../services/institutional.service';
import { InstitutionalContent } from '../../types';
import { SupportUsModal } from './SupportUsModal';
import { AlliancesModal } from './AlliancesModal';

const SobrePanel: React.FC = () => {
    const { t } = useI18n();
    const [content, setContent] = React.useState<Record<string, InstitutionalContent>>({});
    const [loading, setLoading] = React.useState(true);
    const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);
    const [isAlliancesModalOpen, setIsAlliancesModalOpen] = React.useState(false);

    React.useEffect(() => {
        const load = async () => {
            const data = await institutionalService.getAllContent();
            const contentMap: Record<string, InstitutionalContent> = {};
            data.forEach(item => contentMap[item.id] = item);
            setContent(contentMap);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
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

                    <Button
                        onClick={() => setIsSupportModalOpen(true)}
                        className="mt-6 font-semibold shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 border-none text-white rounded-xl flex items-center gap-2"
                    >
                        <Heart className="w-5 h-5 fill-current" />
                        ¡Apóyanos!
                    </Button>
                </div>

                <div className="grid gap-4">
                    {/* Mission */}
                    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-6">
                            <div className="p-2.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                <Sun className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">{content['mission']?.title || t('about.missionTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors whitespace-pre-wrap">
                                {content['mission']?.content_text || t('about.missionText')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* What Is */}
                    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-background hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-6">
                            <div className="p-2.5 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                                <Map className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">{content['what_is']?.title || t('about.whatIsTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors whitespace-pre-wrap">
                                {content['what_is']?.content_text || t('about.whatIsText')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Who Is */}
                    <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-6">
                            <div className="p-2.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Users className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">{content['who_is']?.title || t('about.whoIsTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors whitespace-pre-wrap">
                                {content['who_is']?.content_text || t('about.whoIsText')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <section className="text-center pt-6 pb-8 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <Button asChild className="w-full max-w-sm font-semibold shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none text-white h-12 rounded-xl">
                            <a href={content['website']?.content_text || "http://www.andanzascentrocultural.com"} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-5 w-5 mr-2" />
                                {content['website']?.title || t('about.visitWebsite')}
                            </a>
                        </Button>

                        <div className="flex justify-center items-center gap-4">
                            <a href={content['instagram']?.content_text || "https://www.instagram.com/andanzas_centrocultural/"} target="_blank" rel="noopener noreferrer"
                                className="p-3 rounded-full bg-gradient-to-tr from-orange-400 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all"
                                aria-label="Instagram">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href={content['facebook']?.content_text || "https://www.facebook.com/andanzascentrocultural"} target="_blank" rel="noopener noreferrer"
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
            
            <SupportUsModal
                isOpen={isSupportModalOpen}
                onClose={() => setIsSupportModalOpen(false)}
                onOpenAlliances={() => { setIsSupportModalOpen(false); setTimeout(() => setIsAlliancesModalOpen(true), 150); }}
            />
            <AlliancesModal isOpen={isAlliancesModalOpen} onClose={() => setIsAlliancesModalOpen(false)} />
        </ScrollArea>
    );
};

export default SobrePanel;
