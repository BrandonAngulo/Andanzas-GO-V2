import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

/**
 * Renders a plain-text help body: blank lines separate paragraphs and lines
 * starting with "- " become a bulleted list.
 */
export const HelpBody: React.FC<{ text: string }> = ({ text }) => {
    const lines = (text || '').split('\n');
    const blocks: React.ReactNode[] = [];
    let bullets: string[] = [];

    const flushBullets = () => {
        if (bullets.length) {
            blocks.push(
                <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1.5 marker:text-primary">
                    {bullets.map((b, i) => <li key={i} className="pl-1">{b}</li>)}
                </ul>
            );
            bullets = [];
        }
    };

    lines.forEach((raw) => {
        const line = raw.trimEnd();
        if (/^[-•]\s+/.test(line)) {
            bullets.push(line.replace(/^[-•]\s+/, ''));
        } else if (line.trim() === '') {
            flushBullets();
        } else {
            flushBullets();
            blocks.push(<p key={`p-${blocks.length}`}>{line}</p>);
        }
    });
    flushBullets();

    return <>{blocks}</>;
};

interface InfoHintProps {
    /** Dialog title. */
    title: string;
    /** Plain-text body (paragraphs + "- " bullets). Used when `children` is absent. */
    body?: string;
    /** Rich body content shown inside the dialog (overrides `body`). */
    children?: React.ReactNode;
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
    body,
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
            <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto rounded-3xl border border-primary/10 shadow-2xl">
                {/* Sutil acento superior */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
                <DialogHeader className="relative">
                    <DialogTitle className="flex items-center gap-3 text-xl font-extrabold tracking-tight">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                            {icon || <HelpCircle className="h-5 w-5" />}
                        </span>
                        <span className="pt-0.5">{title}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="relative text-[15px] text-foreground/75 leading-relaxed space-y-3 pt-1">
                    {children ?? (body ? <HelpBody text={body} /> : null)}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InfoHint;
