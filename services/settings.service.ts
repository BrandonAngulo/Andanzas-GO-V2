import { supabase } from '../lib/supabaseClient';

export interface AppSetting {
  key: string;
  value: string;
  description?: string;
}

export interface OperationalSetting {
  key: string;
  value: number;
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
  },

  async getOperationalSetting(key: string, fallback: number): Promise<number> {
    const { data, error } = await supabase
      .from('economy_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching operational setting ${key}:`, error);
      return fallback;
    }

    const parsed = Number(data?.value);
    return Number.isFinite(parsed) ? parsed : fallback;
  },

  async updateOperationalSetting(key: string, value: number): Promise<boolean> {
    const { error } = await supabase.rpc('update_operational_setting', {
      setting_key: key,
      setting_value: value,
    });

    if (error) {
      console.error(`Error updating operational setting ${key}:`, error);
      return false;
    }
    return true;
  }
};
