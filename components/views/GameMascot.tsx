import React from 'react';
import { motion } from 'framer-motion';

export type MascotState = 'idle' | 'correct' | 'wrong' | 'thinking';

interface GameMascotProps {
    icon?: string;       // 'music' | 'leaf' | 'landmark' | 'utensils' | 'ghost' | 'gamepad' (respaldo)
    accent?: string;
    size?: number;
    state?: MascotState;
}

// Cada glifo es un pequeño dibujo propio (no un ícono genérico) que representa el tema del juego.
// Viven en un viewBox 0 0 100 100 y usan currentColor para heredar el color de acento.
const glyphs: Record<string, React.ReactNode> = {
    // Salsa / música (Trivia Cali): una tumbadora con ondas de sonido
    music: (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M38 40 L34 78 Q50 86 66 78 L62 40" fill="currentColor" fillOpacity="0.25" />
            <ellipse cx="50" cy="40" rx="18" ry="7" />
            <path d="M34 78 Q50 86 66 78" />
            <path d="M32 52 Q50 58 68 52" opacity="0.6" />
            <path d="M76 30 Q83 38 76 46" opacity="0.9" />
            <path d="M84 24 Q95 38 84 52" opacity="0.5" />
        </g>
    ),
    // Naturaleza / caña de azúcar (Trivia Valle del Cauca): una hoja con nervadura
    leaf: (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 85 C 30 70, 25 40, 45 18 C 65 40, 62 68, 50 85 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M50 82 L50 24" />
            <path d="M50 45 L38 34" opacity="0.6" />
            <path d="M50 60 L36 52" opacity="0.6" />
        </g>
    ),
    // Historia / monumentos: columna con frontón
    landmark: (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 34 L50 18 L72 34 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M24 34 L76 34" />
            <path d="M32 40 L32 74" />
            <path d="M50 40 L50 74" />
            <path d="M68 40 L68 74" />
            <path d="M22 80 L78 80" />
        </g>
    ),
    // Gastronomía: cubiertos cruzados
    utensils: (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M35 16 L35 46 M29 16 L29 38 Q29 46 35 46 M41 16 L41 38 Q41 46 35 46" />
            <path d="M35 46 L35 84" />
            <path d="M68 16 C 60 20, 58 30, 66 38 L64 84" />
        </g>
    ),
    // Leyendas: fantasma redondeado
    ghost: (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 82 L28 46 Q28 16 50 16 Q72 16 72 46 L72 82 Q64 72 58 82 Q50 90 42 82 Q36 72 28 82 Z" fill="currentColor" fillOpacity="0.25" />
            <circle cx="41" cy="44" r="4" fill="currentColor" stroke="none" />
            <circle cx="59" cy="44" r="4" fill="currentColor" stroke="none" />
        </g>
    ),
    // Respaldo genérico: control de videojuego
    gamepad: (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="20" y="36" width="60" height="34" rx="17" fill="currentColor" fillOpacity="0.25" />
            <path d="M36 45 L36 61 M28 53 L44 53" />
            <circle cx="68" cy="48" r="3" fill="currentColor" stroke="none" />
            <circle cx="60" cy="58" r="3" fill="currentColor" stroke="none" />
        </g>
    ),
};

const mascotVariants = {
    idle: { rotate: 0, scale: 1, y: 0 },
    correct: { rotate: [0, -8, 8, -4, 0], scale: [1, 1.15, 1], y: [0, -6, 0] },
    wrong: { x: [0, -6, 6, -4, 4, 0], rotate: 0, scale: 1 },
    thinking: { rotate: [0, -4, 4, 0], scale: 1, y: 0 },
};

export const GameMascot: React.FC<GameMascotProps> = ({ icon = 'gamepad', accent = '#10B981', size = 72, state = 'idle' }) => {
    const glyph = glyphs[icon] || glyphs.gamepad;
    return (
        <motion.div
            animate={state}
            variants={mascotVariants}
            transition={{ duration: state === 'wrong' ? 0.4 : 0.6, ease: 'easeInOut' }}
            style={{ width: size, height: size, color: accent }}
            className="flex items-center justify-center"
        >
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {glyph}
            </svg>
        </motion.div>
    );
};
