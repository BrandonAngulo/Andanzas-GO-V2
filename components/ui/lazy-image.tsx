import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    textFallback?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc = "https://placehold.co/600x400?text=No+Image",
    textFallback,
    ...props
}) => {
    // State machine: 'loading' | 'loaded' | 'error'
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    // Reset status when src changes
    useEffect(() => {
        if (!src) {
            setStatus('error');
        } else {
            setStatus('loading');
        }
    }, [src]);

    const handleLoad = () => {
        setStatus('loaded');
    };

    const handleError = () => {
        setStatus('error');
    };

    const getGradient = (text: string) => {
        const variants = [
            "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
            "bg-gradient-to-br from-rose-400 to-orange-300",
            "bg-gradient-to-br from-emerald-400 to-cyan-400",
            "bg-gradient-to-br from-blue-600 to-violet-600",
            "bg-gradient-to-br from-amber-200 to-yellow-500",
            "bg-gradient-to-br from-fuchsia-500 to-cyan-500",
        ];
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        return variants[Math.abs(hash) % variants.length];
    };

    return (
        <div className={cn("relative overflow-hidden bg-muted isolate", className)}>
            {/* 1. Loading Skeleton */}
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse z-10">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
            )}

            {/* 2. Error State (Creative Banner or Fallback) */}
            {status === 'error' && (
                <div className="absolute inset-0 h-full w-full z-20 flex flex-col">
                    {textFallback ? (
                        <div className={cn("h-full w-full flex items-center justify-center p-4 text-center", getGradient(textFallback))}>
                            <span className="font-bold text-white text-lg drop-shadow-md line-clamp-2 uppercase tracking-wide">
                                {textFallback}
                            </span>
                        </div>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-2 text-center">
                            <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                            <span className="text-xs">Sin imagen</span>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Real Image (Always rendered to trigger load/error events, hidden if error) */}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    loading="eager" // Changed to eager to force immediate attempt and likely trigger onError faster if broken
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        "h-full w-full object-cover transition-opacity duration-500",
                        status === 'loaded' ? 'opacity-100' : 'opacity-0'
                    )}
                    style={status === 'error' ? { display: 'none' } : undefined}
                    {...props}
                />
            )}
        </div>
    );
};
