// Utilidades de color para derivar, a partir de un único color de acento por juego,
// una paleta secundaria coherente y siempre vibrante (sin importar qué tan claro/oscuro
// sea el acento elegido en el panel de administración).

function hexToHsl(hex: string): [number, number, number] {
    let r = 0, g = 0, b = 0;
    const clean = hex.replace('#', '');
    if (clean.length === 3) {
        r = parseInt(clean[0] + clean[0], 16);
        g = parseInt(clean[1] + clean[1], 16);
        b = parseInt(clean[2] + clean[2], 16);
    } else {
        r = parseInt(clean.substring(0, 2), 16);
        g = parseInt(clean.substring(2, 4), 16);
        b = parseInt(clean.substring(4, 6), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Genera 4 colores siempre vibrantes (saturación y luminosidad fijas) a partir del matiz del acento,
// para que las opciones de una pregunta se reconozcan al instante por color/forma, sin depender de leer el texto.
export const deriveOptionPalette = (accentHex?: string): string[] => {
    const [baseHue] = accentHex ? hexToHsl(accentHex) : [24, 0, 0]; // 24° = naranja, respaldo si no hay acento
    const offsets = [0, 55, 180, 235];
    return offsets.map(off => hslToHex(baseHue + off, 0.72, 0.56));
};
