import { supabase } from '../lib/supabaseClient';

/** Fila cruda de la tabla `badges` tal como la gestiona el admin (sin mapear el ícono a componente). */
export interface BadgeRow {
    id: string;
    nombre: string;
    nombre_en: string | null;
    descripcion: string;
    descripcion_en: string | null;
    icono_name: string;
    image_url: string | null;
    family_key: string | null;
    tier: number | null;
    created_at?: string;
}

export type BadgeInput = Omit<BadgeRow, 'created_at'>;

// CRUD de definiciones de insignias para el panel de administración.
// La lectura es pública; la escritura la gobierna RLS (solo admin/editor).
export const badgesService = {
    async list(): Promise<BadgeRow[]> {
        const { data, error } = await supabase
            .from('badges')
            .select('*')
            .order('family_key', { ascending: true, nullsFirst: false })
            .order('tier', { ascending: true, nullsFirst: true })
            .order('nombre', { ascending: true });
        if (error) throw error;
        return (data ?? []) as BadgeRow[];
    },

    async create(input: BadgeInput): Promise<BadgeRow> {
        const { data, error } = await supabase.from('badges').insert(input).select().single();
        if (error) throw error;
        return data as BadgeRow;
    },

    async update(id: string, input: Partial<BadgeInput>): Promise<BadgeRow> {
        // El id es la clave primaria (texto) y no se cambia al editar.
        const { id: _omit, ...patch } = input as BadgeInput;
        const { data, error } = await supabase.from('badges').update(patch).eq('id', id).select().single();
        if (error) throw error;
        return data as BadgeRow;
    },

    async remove(id: string): Promise<void> {
        // Ojo: user_badges tiene ON DELETE CASCADE — se borran también las que ya ganaron los usuarios.
        const { error } = await supabase.from('badges').delete().eq('id', id);
        if (error) throw error;
    },

    /** Sube una ilustración opcional al bucket público `images` y devuelve su URL pública. */
    async uploadImage(file: File): Promise<string> {
        const ext = file.name.split('.').pop();
        const path = `badges/badge_${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('images').upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from('images').getPublicUrl(path);
        return data.publicUrl;
    },
};
