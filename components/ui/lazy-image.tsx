import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    textFallback?: string; // If provided, shows a creative banner with this text instead of generic icon
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc = "https://placehold.co/600x400?text=No+Image",
    textFallback,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!src) {
            setHasError(true);
            setIsLoading(false);
        } else {
            setHasError(false);
            setIsLoading(true);
        }
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Generate a consistent random gradient based on text length or content
    const getGradient = (text: string) => {
        const variants = [
            "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
            "bg-gradient-to-br from-rose-400 to-orange-300",
            "bg-gradient-to-br from-emerald-400 to-cyan-400",
            "bg-gradient-to-br from-blue-600 to-violet-600",
            "bg-gradient-to-br from-amber-200 to-yellow-500",
            "bg-gradient-to-br from-fuchsia-500 to-cyan-500",
        ];
        // Simple hash
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        return variants[Math.abs(hash) % variants.length];
    };

    return (
        <div className={cn("relative overflow-hidden bg-muted", className)}>
            {/* Loading Skeleton */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse z-10">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
            )}

            {/* Error Fallback: Creative Banner */}
            {hasError && textFallback ? (
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center p-4 text-center z-20",
                    getGradient(textFallback)
                )}>
                    <span className="font-bold text-white text-lg drop-shadow-md line-clamp-2 uppercase tracking-wide">
                        {textFallback}
                    </span>
                </div>
            ) : hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground z-20 p-2 text-center">
                    <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                    <span className="text-xs">Sin imagen</span>
                </div>
            )}

            {/* If no error, or if error but no text fallback, try to show the img (src or fallbackSrc) */}
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
                style={{ display: hasError && textFallback ? 'none' : 'block' }}
                {...props}
            />
        </div>
    );
};
