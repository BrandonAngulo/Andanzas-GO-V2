import React, { useId } from 'react';

// Portadas ilustradas a mano (flat vector, mismo lenguaje que los avatares salsero/bichofué)
// para las trivias. Se seleccionan por la clave 'pattern' del juego (games.theme_pattern),
// de modo que agregar una portada nueva es solo sumar un caso aquí — sin depender de
// imágenes rasterizadas subidas a storage.

interface GameCoverProps {
    pattern?: string;
    className?: string;
}

// --- Trivia Cali: atardecer salsero sobre la Sucursal del Cielo ---
// Cristo Rey y los Farallones al fondo, palmeras, y en primer plano tumbadoras
// con notas musicales. Paleta cálida (naranja/salsa) del tema del juego.
const CaliSalsaCover: React.FC = () => {
    const id = useId();
    return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
                <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A123F" />
                    <stop offset="42%" stopColor="#B5361B" />
                    <stop offset="72%" stopColor="#EC6B1E" />
                    <stop offset="100%" stopColor="#FFC24B" />
                </linearGradient>
                <radialGradient id={`sun-${id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE7A8" />
                    <stop offset="55%" stopColor="#FFC24B" />
                    <stop offset="100%" stopColor="#FF9A3C" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`scrim-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A0A22" stopOpacity="0" />
                    <stop offset="70%" stopColor="#2A0A22" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#1E0718" stopOpacity="0.72" />
                </linearGradient>
            </defs>

            {/* Cielo */}
            <rect width="400" height="200" fill={`url(#sky-${id})`} />

            {/* Sol y su resplandor */}
            <circle cx="248" cy="92" r="70" fill={`url(#sun-${id})`} />
            <circle cx="248" cy="92" r="30" fill="#FFE2A0" />

            {/* Nubes cálidas simples */}
            <g fill="#F7B26A" opacity="0.55">
                <ellipse cx="90" cy="46" rx="34" ry="8" />
                <ellipse cx="130" cy="52" rx="22" ry="6" />
                <ellipse cx="330" cy="38" rx="30" ry="7" />
            </g>

            {/* Farallones lejanos */}
            <path d="M0 132 L60 96 L110 122 L165 88 L220 120 L280 92 L340 124 L400 100 L400 200 L0 200 Z" fill="#5A2350" opacity="0.85" />
            {/* Cordillera media */}
            <path d="M0 150 L70 120 L140 146 L210 118 L285 148 L360 122 L400 140 L400 200 L0 200 Z" fill="#7A2A3E" />

            {/* Cerro de Cristo Rey con la estatua en silueta */}
            <g fill="#3A1230">
                <path d="M40 200 C 60 150, 120 150, 150 200 Z" />
                {/* Pedestal */}
                <rect x="88" y="118" width="14" height="18" rx="2" />
                {/* Cuerpo */}
                <path d="M91 74 L99 74 L101 120 L89 120 Z" />
                {/* Brazos extendidos */}
                <rect x="70" y="86" width="50" height="7" rx="3.5" />
                {/* Cabeza */}
                <circle cx="95" cy="69" r="6.5" />
            </g>

            {/* Palmeras */}
            <g stroke="#2A0A22" strokeWidth="4" strokeLinecap="round" fill="none">
                <path d="M356 200 C 352 170, 350 150, 352 132" />
                <path d="M300 200 C 305 174, 308 156, 306 140" />
            </g>
            <g fill="#2A0A22">
                <g transform="translate(352 132)">
                    <path d="M0 0 C -18 -6, -30 -2, -38 6 C -24 -2, -10 0, 0 4 Z" />
                    <path d="M0 0 C 16 -8, 30 -6, 40 2 C 24 -4, 10 -2, 0 4 Z" />
                    <path d="M0 0 C -8 -18, -6 -30, 2 -38 C -2 -22, 0 -10, 2 0 Z" />
                    <path d="M0 0 C 10 -16, 20 -22, 30 -22 C 16 -16, 6 -8, 2 2 Z" />
                </g>
                <g transform="translate(306 140)">
                    <path d="M0 0 C -14 -5, -24 -2, -30 5 C -19 -2, -8 0, 0 3 Z" />
                    <path d="M0 0 C 13 -6, 24 -5, 32 2 C 19 -3, 8 -2, 0 3 Z" />
                    <path d="M0 0 C -6 -14, -5 -24, 2 -30 C -2 -18, 0 -8, 2 0 Z" />
                </g>
            </g>

            {/* Notas musicales flotando (salsa) */}
            <g fill="#FFE7A8">
                <g transform="translate(178 58)">
                    <circle cx="0" cy="12" r="4.2" />
                    <rect x="3.4" y="-4" width="2.4" height="16" />
                    <path d="M5.8 -4 C 12 -2, 12 4, 8 6 L5.8 4 Z" />
                </g>
                <g transform="translate(206 40) scale(0.8)">
                    <circle cx="0" cy="12" r="4.2" />
                    <rect x="3.4" y="-4" width="2.4" height="16" />
                    <path d="M5.8 -4 C 12 -2, 12 4, 8 6 L5.8 4 Z" />
                </g>
                <circle cx="150" cy="46" r="2.6" opacity="0.9" />
                <circle cx="300" cy="70" r="2.2" opacity="0.85" />
            </g>

            {/* Tumbadoras (congas) en primer plano */}
            <g>
                {/* Conga trasera */}
                <g transform="translate(322 150) rotate(8)">
                    <path d="M-16 0 L16 0 L12 52 L-12 52 Z" fill="#C24A18" />
                    <ellipse cx="0" cy="0" rx="16" ry="6" fill="#F2C48A" />
                    <ellipse cx="0" cy="0" rx="16" ry="6" fill="none" stroke="#8A2F0E" strokeWidth="2.5" />
                    <rect x="-15" y="12" width="30" height="4" fill="#8A2F0E" opacity="0.6" />
                </g>
                {/* Conga delantera */}
                <g transform="translate(296 156) rotate(-7)">
                    <path d="M-19 0 L19 0 L14 60 L-14 60 Z" fill="#E86A22" />
                    <ellipse cx="0" cy="0" rx="19" ry="7" fill="#FBD9A8" />
                    <ellipse cx="0" cy="0" rx="19" ry="7" fill="none" stroke="#A5380F" strokeWidth="3" />
                    <rect x="-18" y="14" width="36" height="4.5" fill="#A5380F" opacity="0.55" />
                    <rect x="-16" y="30" width="32" height="4.5" fill="#A5380F" opacity="0.4" />
                </g>
            </g>

            {/* Bailarina de salsa en silueta */}
            <g fill="#2A0A22" transform="translate(150 152)">
                <circle cx="0" cy="-34" r="6" />
                <path d="M-3 -28 C -8 -18, -6 -6, -2 2 L4 2 C 6 -8, 6 -20, 3 -28 Z" />
                {/* Brazo arriba */}
                <path d="M2 -26 C 12 -32, 18 -40, 20 -48" stroke="#2A0A22" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                {/* Falda con vuelo */}
                <path d="M-2 0 C -22 6, -26 22, -20 40 L22 40 C 26 22, 18 6, 4 0 Z" fill="#8A2F0E" />
                <path d="M-2 0 C -14 6, -18 20, -14 38 L14 38 C 16 20, 10 6, 4 0 Z" fill="#2A0A22" />
                {/* Piernas */}
                <path d="M-6 38 L-9 52 L-3 52 L0 40 Z" />
                <path d="M6 38 L12 50 L18 48 L8 38 Z" />
            </g>

            {/* Scrim inferior para legibilidad del título */}
            <rect width="400" height="200" fill={`url(#scrim-${id})`} />
        </svg>
    );
};

const COVERS: Record<string, React.FC> = {
    salsa: CaliSalsaCover,
};

export const hasGameCover = (pattern?: string): boolean => !!pattern && pattern in COVERS;

export const GameCover: React.FC<GameCoverProps> = ({ pattern, className }) => {
    const Cover = pattern ? COVERS[pattern] : undefined;
    if (!Cover) return null;
    return (
        <div className={className}>
            <Cover />
        </div>
    );
};
