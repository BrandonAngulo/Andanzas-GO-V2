import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc = "https://placehold.co/600x400?text=No+Image",
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={cn("relative overflow-hidden bg-muted", className)}>
            {/* Loading Skeleton */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse z-10">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
            )}

            {/* Error Fallback */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground z-20 p-2 text-center">
                    <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                    <span className="text-xs">Sin imagen</span>
                </div>
            )}

            <img
                src={hasError ? fallbackSrc : src}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    "h-full w-full object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                {...props}
            />
        </div>
    );
};
