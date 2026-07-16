import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface InfoHintProps {
    /** Dialog title. */
    title: string;
    /** Rich body content shown inside the dialog. */
    children: React.ReactNode;
    /** Accessible label / tooltip for the trigger button. */
    label?: string;
    /** Optional icon override (defaults to a help circle). */
    icon?: React.ReactNode;
    className?: string;
    /** Size of the trigger button. */
    size?: 'sm' | 'md';
    /** Optional custom trigger; when provided it replaces the default icon button. */
    trigger?: React.ReactNode;
}

/**
 * Small "?" affordance placed next to a section title. Clicking it opens a
 * dialog that explains what the section/feature is about. Reused across panels
 * (map, profile, etc.) so every window can explain itself.
 */
export const InfoHint: React.FC<InfoHintProps> = ({
    title,
    children,
    label = 'Más información',
    icon,
    className,
    size = 'md',
    trigger,
}) => {
    const [open, setOpen] = React.useState(false);
    const dim = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <button
                        type="button"
                        aria-label={label}
                        title={label}
                        className={cn(
                            "inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            dim,
                            className
                        )}
                    >
                        {icon || <HelpCircle className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />}
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3 pt-1">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InfoHint;
