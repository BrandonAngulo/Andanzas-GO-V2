import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface CategoryCarouselProps {
  categories: { id: string; label: string; icon?: React.ReactNode }[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  className
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      // Update arrows after scrolling animation finishes
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className={cn("relative group mb-6", className)}>
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          aria-label="Desplazar a la izquierda"
          className="absolute left-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full border-border/50 bg-background/80 shadow-md backdrop-blur-sm hover:bg-background md:flex"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar scroll-smooth snap-x"
        onScroll={checkScroll}
      >
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {cat.icon && <span className={cn("flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")}>{cat.icon}</span>}
              {cat.label}
            </button>
          );
        })}
      </div>

      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          aria-label="Desplazar a la derecha"
          className="absolute right-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full border-border/50 bg-background/80 shadow-md backdrop-blur-sm hover:bg-background md:flex"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
