import React, { useRef } from 'react';
import { Move, ZoomIn, RotateCcw } from 'lucide-react';

// Reposicionador de imagen reutilizable (banner de perfil + gestión de imágenes en admin).
// Modelo de datos mínimo y portable: punto focal (x,y en %) + zoom. Se guarda como jsonb
// y se aplica con la MISMA convención de render en cualquier lugar (ver imagePositionStyle).
export interface ImagePosition {
    x: number; // 0..100  -> object-position X (punto que se mantiene visible)
    y: number; // 0..100  -> object-position Y
    zoom: number; // 1..3  -> escala (acercar)
}

export const DEFAULT_IMAGE_POSITION: ImagePosition = { x: 50, y: 50, zoom: 1 };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Normaliza cualquier valor guardado (o null) a un ImagePosition válido.
export const normalizeImagePosition = (pos?: Partial<ImagePosition> | null): ImagePosition => ({
    x: clamp(Number(pos?.x ?? 50), 0, 100),
    y: clamp(Number(pos?.y ?? 50), 0, 100),
    zoom: clamp(Number(pos?.zoom ?? 1), 1, 3),
});

// Estilo de render para un <img className="... object-cover"> dentro de un contenedor overflow-hidden.
// Sirve igual para el banner del perfil, imperdibles, banners de admin, imágenes de contenido, etc.
export const imagePositionStyle = (pos?: Partial<ImagePosition> | null): React.CSSProperties => {
    const p = normalizeImagePosition(pos);
    return {
        objectFit: 'cover',
        objectPosition: `${p.x}% ${p.y}%`,
        transform: p.zoom !== 1 ? `scale(${p.zoom})` : undefined,
        transformOrigin: `${p.x}% ${p.y}%`,
    };
};

interface ImagePositionerProps {
    imageUrl: string;
    value: ImagePosition;
    onChange: (value: ImagePosition) => void;
    /** Clase de aspecto del marco de edición (aprox. la proporción donde se mostrará). */
    aspectClassName?: string;
    className?: string;
}

// Editor: arrastrar para mover, deslizador para acercar. No persiste nada; el contenedor decide.
export const ImagePositioner: React.FC<ImagePositionerProps> = ({
    imageUrl,
    value,
    onChange,
    aspectClassName = 'aspect-[16/6]',
    className = '',
}) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ cx: number; cy: number; px: number; py: number } | null>(null);
    const v = normalizeImagePosition(value);

    const onPointerDown = (e: React.PointerEvent) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        drag.current = { cx: e.clientX, cy: e.clientY, px: v.x, py: v.y };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current || !frameRef.current) return;
        const r = frameRef.current.getBoundingClientRect();
        const dx = e.clientX - drag.current.cx;
        const dy = e.clientY - drag.current.cy;
        // Arrastrar a la derecha revela el lado izquierdo => el punto focal X baja.
        // Dividimos por zoom para que el paneo se sienta parejo cuando está acercada.
        const nx = clamp(drag.current.px - (dx / r.width) * 100 / v.zoom, 0, 100);
        const ny = clamp(drag.current.py - (dy / r.height) * 100 / v.zoom, 0, 100);
        onChange({ ...v, x: nx, y: ny });
    };
    const onPointerUp = () => { drag.current = null; };

    return (
        <div className={className}>
            <div
                ref={frameRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className={`relative w-full ${aspectClassName} overflow-hidden rounded-2xl border border-border bg-muted cursor-grab active:cursor-grabbing touch-none select-none`}
            >
                <img
                    src={imageUrl}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    style={imagePositionStyle(v)}
                />
                {/* Guías (regla de tercios) para ayudar a encuadrar */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute left-1/3 top-0 h-full w-px bg-white/60" />
                    <div className="absolute left-2/3 top-0 h-full w-px bg-white/60" />
                    <div className="absolute top-1/3 left-0 w-full h-px bg-white/60" />
                    <div className="absolute top-2/3 left-0 w-full h-px bg-white/60" />
                </div>
                <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[11px] font-medium text-white">
                    <Move className="h-3 w-3" /> Arrastrá para mover
                </div>
            </div>

            {/* Zoom */}
            <div className="mt-3 flex items-center gap-3">
                <ZoomIn className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.02}
                    value={v.zoom}
                    onChange={(e) => onChange({ ...v, zoom: clamp(Number(e.target.value), 1, 3) })}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    aria-label="Zoom"
                />
                <button
                    type="button"
                    onClick={() => onChange({ ...DEFAULT_IMAGE_POSITION })}
                    title="Restablecer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                    <RotateCcw className="h-3.5 w-3.5" /> Restablecer
                </button>
            </div>
        </div>
    );
};
