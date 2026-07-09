import React from 'react';
import { BotMessageSquare, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface AndiGuiaProps {
  message: string;
  variant?: 'default' | 'tip' | 'warning' | 'celebration';
  onClose?: () => void;
  className?: string;
}

export const AndiGuia: React.FC<AndiGuiaProps> = ({
  message,
  variant = 'default',
  onClose,
  className
}) => {
  const variantStyles = {
    default: 'bg-primary/5 border-primary/20',
    tip: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-800 dark:text-yellow-200',
    warning: 'bg-destructive/10 border-destructive/20 text-destructive',
    celebration: 'bg-green-500/10 border-green-500/20 text-green-800 dark:text-green-200'
  };

  const iconColors = {
    default: 'text-primary',
    tip: 'text-yellow-600 dark:text-yellow-400',
    warning: 'text-destructive',
    celebration: 'text-green-600 dark:text-green-400'
  };

  return (
    <Card className={cn("relative overflow-hidden border shadow-sm", variantStyles[variant], className)}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className={cn("p-2 rounded-full bg-background/80 shadow-sm shrink-0", iconColors[variant])}>
          <BotMessageSquare className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 shrink-0 -mt-1 -mr-1 opacity-50 hover:opacity-100 rounded-full"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
