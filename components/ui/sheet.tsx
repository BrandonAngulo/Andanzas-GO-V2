import React, { createContext, useContext, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface SheetContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: 'left' | 'right' | 'top' | 'bottom';
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('useSheet must be used within a Sheet');
  return context;
};

const Sheet: React.FC<React.PropsWithChildren<SheetContextProps>> = ({ open, onOpenChange, side = 'left', children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onOpenChange]);

  return <SheetContext.Provider value={{ open, onOpenChange, side }}>{children}</SheetContext.Provider>;
};

const SheetTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild }) => {
  const { onOpenChange } = useSheet();
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

const SheetContent: React.FC<React.PropsWithChildren<{ className?: string, showCloseButton?: boolean }>> = ({ children, className, showCloseButton = true }) => {
  const { open, onOpenChange, side } = useSheet();

  const variants = {
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
    top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
    bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[2000] bg-black/30" onClick={() => onOpenChange(false)} />
      <div className={cn('fixed z-[2000] gap-3 bg-background p-4 shadow-lg transition ease-in-out sm:p-5', variants[side], className)}>
        {children}
        {showCloseButton && (
          <button type="button" aria-label="Cerrar" onClick={() => onOpenChange(false)} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full opacity-70 ring-offset-background transition-opacity hover:bg-muted hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none sm:right-4 sm:top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        )}
      </div>
    </>
  );
};

export { Sheet, SheetTrigger, SheetContent };
