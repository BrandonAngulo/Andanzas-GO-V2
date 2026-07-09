import { supabase } from '../lib/supabaseClient';
import { CuriousFact } from '../types';

export const curiositiesService = {
  /**
   * Obtiene TODAS las curiosidades para el panel de administración
   */
  async getAllAdmin(): Promise<CuriousFact[]> {
    const { data, error } = await supabase
      .from('curious_facts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin curiosities:', error);
      return [];
    }
    return data as CuriousFact[];
  },

  /**
   * Obtiene solo las curiosidades PUBLICADAS para mostrar en el frontend (Home, Pa' que sepás)
   */
  async getPublished(location?: 'home' | 'pa_que_sepas'): Promise<CuriousFact[]> {
    let query = supabase
      .from('curious_facts')
      .select('*')
      .eq('status', 'published');

    if (location === 'home') {
      query = query.eq('show_in_home', true);
    } else if (location === 'pa_que_sepas') {
      query = query.eq('show_in_pa_que_sepas', true);
    }

    const { data, error } = await query.order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching published curiosities:', error);
      return [];
    }
    return data as CuriousFact[];
  },

  /**
   * Crea una nueva curiosidad
   */
  async createCuriosity(curiosity: Omit<CuriousFact, 'id' | 'created_at' | 'updated_at'>): Promise<CuriousFact | null> {
    const { data, error } = await supabase
      .from('curious_facts')
      .insert([curiosity])
      .select()
      .single();

    if (error) {
      console.error('Error creating curiosity:', error);
      return null;
    }
    return data as CuriousFact;
  },

  /**
   * Actualiza una curiosidad existente
   */
  async updateCuriosity(id: string, updates: Partial<CuriousFact>): Promise<boolean> {
    // Manejar el published_at si el status cambia a published
    if (updates.status === 'published' && !updates.published_at) {
        updates.published_at = new Date().toISOString();
    }
    // Manejar el archived_at si el status cambia a archived
    if (updates.status === 'archived' && !updates.archived_at) {
        updates.archived_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('curious_facts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating curiosity:', error);
      return false;
    }
    return true;
  },

  /**
   * Elimina permanentemente una curiosidad
   */
  async deleteCuriosity(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('curious_facts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting curiosity:', error);
      return false;
    }
    return true;
  }
};
