import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Moon, Sun, Monitor, Bell, Globe, Database, Trash2 } from 'lucide-react';
import { useI18n } from '../../i18n';

interface ConfiguracionPanelProps {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ConfiguracionPanel: React.FC<ConfiguracionPanelProps> = ({ theme, setTheme }) => {
    const { t, language, setLanguage } = useI18n();

    const handleClearCache = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-3 space-y-4">

                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sun className="h-4 w-4" /> {t('config.appearance')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">{t('config.theme')}</label>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-4 w-4 mr-2" /> {t('config.light')}
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-4 w-4 mr-2" /> {t('config.dark')}
                                </Button>
                                <Button
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setTheme('system')}
                                >
                                    <Monitor className="h-4 w-4 mr-2" /> {t('config.system')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Language */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="h-4 w-4" /> {t('config.language')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">{t('language')}</label>
                            <div className="flex gap-2">
                                <Button
                                    variant={language === 'es' ? 'default' : 'outline'}
                                    className="flex-1 justify-start pl-4"
                                    onClick={() => setLanguage('es')}
                                >
                                    <span className="mr-2 text-lg">🇪🇸</span> {t('config.spanish')}
                                </Button>
                                <Button
                                    variant={language === 'en' ? 'default' : 'outline'}
                                    className="flex-1 justify-start pl-4"
                                    onClick={() => setLanguage('en')}
                                >
                                    <span className="mr-2 text-lg">🇺🇸</span> {t('config.english')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Bell className="h-4 w-4" /> {t('config.notifications')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">{t('config.pushNotifications')}</label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">{t('config.emailNotifications')}</label>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Database className="h-4 w-4" /> {t('config.dataAndPrivacy')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-muted-foreground mb-2">Si tienes problemas con la aplicación, borrar la caché local puede ayudar. Esto no eliminará tu cuenta.</p>
                            <Button variant="destructive" size="sm" onClick={handleClearCache} className="w-full sm:w-auto">
                                <Trash2 className="h-4 w-4 mr-2" /> {t('config.clearCache')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </ScrollArea>
    );
};

export default ConfiguracionPanel;