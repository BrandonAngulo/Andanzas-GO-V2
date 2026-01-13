
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
}

const StarRating: React.FC<StarRatingProps> = ({ value = 0, onChange, size = 'sm' }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const dim = size === 'sm' ? 18 : 24;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Calificación">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          aria-label={`${s} estrellas`}
          className="p-0.5"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange?.(s)}
        >
          <Star
            width={dim}
            height={dim}
            className={cn(
              "transition-transform",
              (hover || value) >= s ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
