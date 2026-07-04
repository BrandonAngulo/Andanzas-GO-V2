import React, { useState } from 'react';
import { LearnEntry } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, MapPin, ChevronRight, Hash, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { Badge } from '../ui/badge';

interface PaQueSepasPanelProps {
    entries: LearnEntry[];
    onOpenSite?: (siteId: string) => void;
}

const PaQueSepasPanel: React.FC<PaQueSepasPanelProps> = ({ entries, onOpenSite }) => {
    const { t, language } = useI18n();
    const [selectedEntry, setSelectedEntry] = useState<LearnEntry | null>(null);

    if (selectedEntry) {
        return (
            <ScrollArea className="h-[72vh] bg-background">
                <div className="p-4 md:p-6 max-w-3xl mx-auto">
                    <Button variant="ghost" onClick={() => setSelectedEntry(null)} className="mb-4 -ml-2 text-muted-foreground">
                        ← Volver a Saberes
                    </Button>
                    
                    {selectedEntry.image_url && (
                        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 bg-muted">
                            <img src={selectedEntry.image_url} alt={getTranslated(selectedEntry, 'title', language)} className="w-full h-full object-cover" />
                        </div>
                    )}
                    
                    <div className="mb-6 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            <MapPin className="w-3 h-3 mr-1" /> {selectedEntry.city}
                        </Badge>
                        {selectedEntry.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-muted-foreground">
                                <Hash className="w-3 h-3 mr-1" /> {tag}
                            </Badge>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-foreground">{getTranslated(selectedEntry, 'title', language)}</h2>
                    
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-4">
                        {(getTranslated(selectedEntry, 'content_full', language) as string || getTranslated(selectedEntry, 'content_simple', language) as string || '').split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-foreground/90 leading-relaxed text-[16px] whitespace-pre-wrap">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {selectedEntry.sabias_que && selectedEntry.sabias_que.length > 0 && (
                        <div className="mt-8 p-6 relative overflow-hidden rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                            <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-primary relative z-10">
                                <Sparkles className="w-5 h-5" />
                                Datos curiosos
                            </h3>
                            <ul className="space-y-4 relative z-10">
                                {selectedEntry.sabias_que.map((sq, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-[15px] text-foreground/80 leading-relaxed">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <span>{sq}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(selectedEntry.site_ids?.length) && onOpenSite && (
                        <div className="mt-10 p-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center shadow-sm">
                            <h4 className="font-bold text-xl mb-3 text-foreground">Vívelo tú mismo</h4>
                            <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                                {selectedEntry.cta || "Esta historia cobra vida en uno de nuestros sitios recomendados."}
                            </p>
                            <Button 
                                onClick={() => {
                                    const targetId = selectedEntry.site_ids?.[0];
                                    if (targetId) onOpenSite(targetId);
                                }}
                                className="rounded-full px-8 py-6 text-md font-semibold shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                            >
                                Ver lugar relacionado <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="h-[72vh] bg-muted/20">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 mb-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Pa' que sepás
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Aprende sobre la cultura, la historia y los secretos mejor guardados de la ciudad. El por qué importa lo que ves.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map(entry => (
                        <Card 
                            key={entry.id} 
                            className="cursor-pointer group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-border/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl"
                            onClick={() => setSelectedEntry(entry)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="p-6 relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        <MapPin className="w-3 h-3" /> {entry.city}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                        <BookOpen className="w-4 h-4 text-primary opacity-70 group-hover:opacity-100" />
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                    {getTranslated(entry, 'title', language)}
                                </h3>
                                
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                                    {(getTranslated(entry, 'content_full', language) as string || getTranslated(entry, 'content_simple', language) as string || '').split('\n\n')[0]}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {entry.tags?.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground border-0 transition-colors">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="text-primary group-hover:translate-x-1 transition-transform">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                {entries.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No hay historias disponibles aún para esta ciudad.</p>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default PaQueSepasPanel;
