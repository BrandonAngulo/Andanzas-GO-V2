import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Moon, Sun, Monitor, Bell, Globe, Database, Trash2, Shield, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

interface ConfiguracionPanelProps {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ConfiguracionPanel: React.FC<ConfiguracionPanelProps> = ({ theme, setTheme }) => {
    const { t, language, setLanguage } = useI18n();
    const { user, logout } = useAuth();

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [deletePassword, setDeletePassword] = React.useState('');
    const [deleteError, setDeleteError] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleClearCache = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleDeleteAccount = async () => {
        if (!user || (!user.email && !user.user_metadata.email)) {
            setDeleteError("No se pudo identificar el usuario.");
            return;
        }
        setIsDeleting(true);
        setDeleteError('');

        try {
            // 1. Verify password
            const email = user.email || user.user_metadata.email;
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: deletePassword
            });
            if (authError) throw new Error("Contraseña incorrecta. Inténtalo de nuevo.");

            // 2. Delete Profile Data (Soft delete or depend on RLS)
            // Note: Client cannot delete Auth User directly without Admin API. 
            // We delete the profile data to effectively wipe the user's existence in the app.
            const { error: dbError } = await supabase.from('profiles').delete().eq('id', user.id);
            if (dbError) throw new Error("Error eliminando datos: " + dbError.message);

            // 3. Logout
            await logout();
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            setDeleteError(err.message || "Error al eliminar la cuenta.");
        } finally {
            setIsDeleting(false);
        }
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

                {/* Legal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Legal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button variant="outline" className="justify-start h-auto py-3" asChild>
                                <a href="/terms" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {t('termsOfService') || "Términos de Servicio"}
                                </a>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto py-3" asChild>
                                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {t('privacyPolicy') || "Política de Privacidad"}
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                {user && (
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-4 w-4" /> Eliminar Cuenta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">Eliminar cuenta permanentemente</p>
                                    <p>Esta acción no se puede deshacer. Perderás todo tu progreso.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar Cuenta
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="sm:max-w-md border-destructive/20">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" /> Eliminar Cuenta
                        </DialogTitle>
                        <DialogDescription>
                            Para continuar, por favor ingresa tu contraseña. Esta acción eliminará permanentemente tu perfil, insignias y progreso.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contraseña</label>
                            <Input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Confirma tu contraseña"
                            />
                        </div>

                        {deleteError && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {deleteError}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={!deletePassword || isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Eliminación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ScrollArea>
    );
};

export default ConfiguracionPanel;