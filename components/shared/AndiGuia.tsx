import React from 'react';
import { BotMessageSquare, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface AndiGuiaProps {
  message: string;
  variant?: 'default' | 'tip' | 'warning' | 'celebration';
  onClose?: () => void;
  className?: string;
}

export const AndiGuia: React.FC<AndiGuiaProps> = ({
  message,
  variant = 'default',
  className
}) => {
  const [open, setOpen] = React.useState(false);

  const variantStyles = {
    default: 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20',
    tip: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20 dark:text-yellow-400',
    warning: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20',
    celebration: 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 dark:text-green-400'
  };

  const iconColors = {
    default: 'text-primary',
    tip: 'text-yellow-600 dark:text-yellow-400',
    warning: 'text-destructive',
    celebration: 'text-green-600 dark:text-green-400'
  };

  const titles = {
    default: 'Mensaje de Andi',
    tip: 'Tip de Andi',
    warning: 'Atención',
    celebration: '¡Excelente!'
  };

  return (
    <div className={cn("flex justify-end", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            {/* Ping animation behind the button */}
            <div className={cn("absolute inset-0 rounded-full animate-ping opacity-75", variantStyles[variant].split(' ')[0])}></div>
            <Button 
              variant="outline" 
              size="icon"
              className={cn(
                "relative rounded-full border-2 shadow-lg flex items-center justify-center w-12 h-12 transition-all duration-300 hover:scale-110 group-hover:shadow-xl", 
                variantStyles[variant],
                "bg-background/95 backdrop-blur-sm"
              )}
            >
              <BotMessageSquare className={cn("w-6 h-6", iconColors[variant])} />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full bg-muted/50", iconColors[variant])}>
                <BotMessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">{titles[variant]}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2 pb-4">
            <p className="text-base text-foreground leading-relaxed font-medium">
              {message}
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)} className="rounded-full px-6">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
