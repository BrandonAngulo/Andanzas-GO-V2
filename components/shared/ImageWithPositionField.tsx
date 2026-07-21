import React, { useState } from 'react';
import { ImagePositioner, ImagePosition, imagePositionStyle, normalizeImagePosition, DEFAULT_IMAGE_POSITION } from './ImagePositioner';
import { Move, ChevronUp } from 'lucide-react';

// Campo de imagen reutilizable para formularios de ADMIN.
// Combina la URL (input existente) + un editor de encuadre (arrastrar + zoom) inline.
// Produce { image_url, image_position }. Pensado para adoptarse en cualquier formulario
// de gestión de contenido con el mismo look & feel.
interface ImageWithPositionFieldProps {
    label?: string;
    url: string;
    onUrlChange: (url: string) => void;
    position?: ImagePosition | null;
    onPositionChange: (pos: ImagePosition | null) => void;
    required?: boolean;
    placeholder?: string;
    /** Proporción del marco de encuadre; aproxima cómo se recorta en la vista real. */
    aspectClassName?: string;
    helpText?: string;
}

export const ImageWithPositionField: React.FC<ImageWithPositionFieldProps> = ({
    label = 'URL de la Imagen',
    url,
    onUrlChange,
    position,
    onPositionChange,
    required,
    placeholder = 'https://...',
    aspectClassName = 'aspect-[16/9]',
    helpText,
}) => {
    const [editing, setEditing] = useState(false);
    const pos = normalizeImagePosition(position);

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold">{label}{required && ' *'}</label>
            <input
                required={required}
                value={url || ''}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder={placeholder}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />

            {url ? (
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                    {!editing ? (
                        <div className="flex items-center gap-3">
                            <div className={`relative w-28 shrink-0 ${aspectClassName} overflow-hidden rounded-lg border border-border bg-muted`}>
                                <img src={url} alt="" className="absolute inset-0 h-full w-full" style={imagePositionStyle(pos)} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground">
                                    Encuadre: {pos.x === 50 && pos.y === 50 && pos.zoom === 1 ? 'centrado (por defecto)' : `x ${Math.round(pos.x)}% · y ${Math.round(pos.y)}% · zoom ${pos.zoom.toFixed(2)}×`}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
                                >
                                    <Move className="h-3.5 w-3.5" /> Reposicionar imagen
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <ImagePositioner
                                imageUrl={url}
                                value={pos}
                                onChange={(v) => onPositionChange(v)}
                                aspectClassName={aspectClassName}
                            />
                            <div className="mt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
                                >
                                    <ChevronUp className="h-3.5 w-3.5" /> Listo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
        </div>
    );
};

export { DEFAULT_IMAGE_POSITION };
