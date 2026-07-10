import { supabase } from '../lib/supabase';

export interface AppSetting {
  key: string;
  value: string;
  description?: string;
}

export const settingsService = {
  async getSetting(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') {
          console.error(`Error fetching setting ${key}:`, error);
        }
        return null;
      }
      return data?.value || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getAllSettings(): Promise<AppSetting[]> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data as AppSetting[];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async updateSetting(key: string, value: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
