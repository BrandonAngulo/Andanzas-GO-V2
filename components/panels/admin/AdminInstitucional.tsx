import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Loader2, Save, Info } from 'lucide-react';
import { toast } from 'sonner';
import { institutionalService } from '../../../services/institutional.service';
import { InstitutionalContent } from '../../../types';

export const AdminInstitucional: React.FC = () => {
    const [contentMap, setContentMap] = useState<Record<string, InstitutionalContent>>({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        const data = await institutionalService.getAllContent();
        const map: Record<string, InstitutionalContent> = {};
        data.forEach(item => { map[item.id] = item; });
        setContentMap(map);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (id: string) => {
        if (!contentMap[id]) return;
        setSavingId(id);
        const success = await institutionalService.updateContent(id, contentMap[id].content_text);
        if (success) {
            toast.success('Contenido guardado correctamente');
        } else {
            toast.error('Error al guardar el contenido');
        }
        setSavingId(null);
    };

    const handleChange = (id: string, text: string) => {
        setContentMap(prev => ({
            ...prev,
            [id]: { ...prev[id], content_text: text }
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const items = [
        { id: 'mission', label: 'Nuestra Misión', type: 'textarea' },
        { id: 'what_is', label: '¿Qué es Andanzas GO?', type: 'textarea' },
        { id: 'who_is', label: '¿Quiénes somos?', type: 'textarea' },
        { id: 'website', label: 'Enlace del Sitio Web', type: 'input' },
        { id: 'instagram', label: 'Enlace de Instagram', type: 'input' },
        { id: 'facebook', label: 'Enlace de Facebook', type: 'input' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold">Contenido Institucional (Sobre Andanzas)</h3>
                <p className="text-sm text-muted-foreground mt-1">Gestiona los textos de la misión, visión, y enlaces a redes sociales que se muestran en el panel 'Sobre Andanzas'.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {items.map(item => (
                    <Card key={item.id} className="border-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md flex items-center justify-between">
                                {item.label}
                                {savingId === item.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {item.type === 'textarea' ? (
                                <Textarea 
                                    className="min-h-[120px]" 
                                    value={contentMap[item.id]?.content_text || ''} 
                                    onChange={(e) => handleChange(item.id, e.target.value)}
                                />
                            ) : (
                                <Input 
                                    value={contentMap[item.id]?.content_text || ''} 
                                    onChange={(e) => handleChange(item.id, e.target.value)}
                                />
                            )}
                            <Button onClick={() => handleSave(item.id)} disabled={savingId === item.id} className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Guardar
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
