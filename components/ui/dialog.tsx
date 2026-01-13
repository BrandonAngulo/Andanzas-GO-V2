import React, { createContext, useContext } from 'react';
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

const DialogContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const { open, onOpenChange } = useDialog();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange(false)}
      ></div>
      <div className={cn("relative z-10 w-full max-w-lg p-6 bg-popover text-popover-foreground rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200", className)}>
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-50">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
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