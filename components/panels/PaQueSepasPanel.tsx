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
                        <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <Sparkles className="w-5 h-5" />
                                Datos curiosos
                            </h3>
                            <ul className="space-y-3">
                                {selectedEntry.sabias_que.map((sq, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>{sq}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(selectedEntry.site_ids?.length || selectedEntry.site_id) && onOpenSite && (
                        <div className="mt-10 p-5 bg-card border rounded-2xl shadow-sm text-center">
                            <h4 className="font-semibold mb-2">Vívelo tú mismo</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                {selectedEntry.cta || "Esta historia cobra vida en uno de nuestros sitios recomendados."}
                            </p>
                            <Button onClick={() => {
                                const targetId = selectedEntry.site_ids?.[0] || selectedEntry.site_id;
                                if (targetId) onOpenSite(targetId);
                            }}>
                                Ver lugar relacionado <ChevronRight className="w-4 h-4 ml-1" />
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
                            className="cursor-pointer group hover:shadow-md transition-all duration-300 border-border/60 hover:border-primary/30"
                            onClick={() => setSelectedEntry(entry)}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                                    <MapPin className="w-3 h-3 text-primary" /> {entry.city}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {getTranslated(entry, 'title', language)}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                                    {(getTranslated(entry, 'content_full', language) as string || getTranslated(entry, 'content_simple', language) as string || '').split('\n\n')[0]}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {entry.tags?.slice(0, 2).map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground text-[10px]">
                                            {tag}
                                        </Badge>
                                    ))}
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
