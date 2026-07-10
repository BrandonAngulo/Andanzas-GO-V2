import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Settings, Save } from 'lucide-react';
import { settingsService, AppSetting } from '../../../services/settings.service';

export const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<AppSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadSettings = async () => {
        setLoading(true);
        const data = await settingsService.getAllSettings();
        setSettings(data);
        setLoading(false);
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleToggle = async (key: string, currentValue: string) => {
        setSaving(true);
        const newValue = currentValue === 'true' ? 'false' : 'true';
        // Optimistic update
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
        await settingsService.updateSetting(key, newValue);
        setSaving(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ajustes de la Aplicación</h2>
                    <p className="text-muted-foreground">Activa o desactiva funciones globales de la plataforma.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Feature Flags (Interruptores de Funciones)</CardTitle>
                    <CardDescription>Controla qué características están disponibles para los usuarios finales.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="text-center p-4 text-muted-foreground">Cargando ajustes...</div>
                    ) : settings.length === 0 ? (
                        <div className="text-center p-4 text-muted-foreground border-2 border-dashed rounded-xl">No hay ajustes configurados.</div>
                    ) : (
                        settings.map((setting) => (
                            <div key={setting.key} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/10 transition-colors">
                                <div className="space-y-0.5">
                                    <h4 className="font-medium text-sm">
                                        {setting.key === 'enable_custom_route_requests' ? 'Solicitudes de Rutas Personalizadas' : setting.key}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{setting.description || 'Sin descripción'}</p>
                                </div>
                                <Switch 
                                    checked={setting.value === 'true'} 
                                    onChange={(e) => handleToggle(setting.key, setting.value)}
                                    disabled={saving}
                                />
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
