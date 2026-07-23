import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface DialogContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a Dialog');
  }
  return context;
};

const Dialog: React.FC<React.PropsWithChildren<DialogContextProps>> = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild }) => {
  const { onOpenChange } = useDialog();
  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: (...args: any[]) => {
          if ((child.props as any).onClick) {
            (child.props as any).onClick(...args);
          }
          onOpenChange(true);
        },
      });
    }
    return <>{children}</>;
  }
  return <div onClick={() => onOpenChange(true)}>{children}</div>;
};

const DialogContent: React.FC<React.PropsWithChildren<{ className?: string; showCloseButton?: boolean }>> = ({ children, className, showCloseButton = true }) => {
  const { open, onOpenChange } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1400] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange(false)}
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        className={cn("relative z-10 max-h-[96dvh] w-full max-w-lg rounded-t-3xl bg-popover p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 sm:rounded-lg sm:p-6", className)}
      >
        {showCloseButton && (
          <button type="button" aria-label="Cerrar" onClick={() => onOpenChange(false)} className="absolute right-3 top-3 z-50 grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:right-4 sm:top-4 sm:h-9 sm:w-9">
            <X size={24} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

const DialogHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}>{children}</div>
);

const DialogTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>
);

const DialogDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);

const DialogFooter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}>{children}</div>
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
