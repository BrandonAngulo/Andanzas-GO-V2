import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Context for Select Root ---
interface SelectContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}
const SelectContext = createContext<SelectContextProps | undefined>(undefined);
const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('useSelect must be used within a Select');
  return context;
};

// --- Context for Select Item ---
const SelectItemContext = createContext<{ value: string } | undefined>(undefined);
const useSelectItem = () => {
  const context = useContext(SelectItemContext);
  if (!context) throw new Error('useSelectItem must be used within a SelectItem');
  return context;
};


// --- Components ---

const Select: React.FC<React.PropsWithChildren<{ value?: string; onValueChange?: (value: string) => void }>> = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider value={{ open, onOpenChange: setOpen, value, onValueChange, triggerRef }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange, open, triggerRef } = useSelect();
  
  // Combine forwarded ref and internal ref
  const composedRef = (node: HTMLButtonElement | null) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
    (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };

  return (
    <button
      ref={composedRef}
      onClick={() => onOpenChange(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
    const { value } = useSelect();
    return <span>{value || placeholder}</span>;
};

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open } = useSelect();
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-full mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        className
      )}
      {...props}
    >
        {children}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { onValueChange, onOpenChange, value: selectedValue } = useSelect();
  const isSelected = selectedValue === value;
  
  return (
    <SelectItemContext.Provider value={{ value }}>
      <div
        ref={ref}
        onClick={() => {
          onValueChange?.(value);
          onOpenChange(false);
        }}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          isSelected && "font-semibold",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SelectItemContext.Provider>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = 'SelectLabel';

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = 'SelectSeparator';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator };
