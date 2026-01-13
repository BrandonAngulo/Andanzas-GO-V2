
import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Context for Accordion Root ---
interface AccordionContextProps {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}
const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('useAccordion must be used within an Accordion');
  return context;
};

// --- Context for Accordion Item ---
const AccordionItemContext = createContext<{ value: string } | undefined>(undefined);
const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('useAccordionItem must be used within an AccordionItem');
  return context;
};

// --- Components ---

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string }
>(({ children, defaultValue, ...props }, ref) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);
  
  const onValueChange = (newValue: string | undefined) => {
    setValue(value === newValue ? undefined : newValue);
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} {...props}>{children}</div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <AccordionItemContext.Provider value={{ value }}>
    <div ref={ref} className={cn('border-b', className)} {...props} />
  </AccordionItemContext.Provider>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = useAccordion();
  const { value: itemValue } = useAccordionItem();
  const isOpen = value === itemValue;
  
  return (
    <h3>
      <button
        ref={ref}
        onClick={() => onValueChange(itemValue)}
        className={cn(
          'flex flex-1 w-full items-center justify-between text-left py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
        aria-expanded={isOpen}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value } = useAccordion();
  const { value: itemValue } = useAccordionItem();
  const isOpen = value === itemValue;

  if (!isOpen) return null;
  
  return (
    <div
      ref={ref}
      className={cn('overflow-hidden text-sm text-muted-foreground', className)}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
