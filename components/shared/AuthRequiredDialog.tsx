import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';
import { useI18n } from '../../i18n';

interface AuthRequiredDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: () => void;
    title?: string;
    description?: string;
}

const AuthRequiredDialog: React.FC<AuthRequiredDialogProps> = ({
    open,
    onOpenChange,
    onLogin,
    title,
    description
}) => {
    const { t, language } = useI18n();

    const defaultTitle = language === 'es' ? 'Inicia sesión' : 'Log in';
    const defaultDesc = language === 'es'
        ? 'Necesitas una cuenta para realizar esta acción. ¡Es gratis y rápido!'
        : 'You need an account to perform this action. It\'s free and fast!';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">{title || defaultTitle}</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {description || defaultDesc}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                    </Button>
                    <Button onClick={() => { onOpenChange(false); onLogin(); }} className="w-full sm:w-auto bg-gradient-to-r from-primary to-emerald-600">
                        {language === 'es' ? 'Ir al Login' : 'Go to Login'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AuthRequiredDialog;
