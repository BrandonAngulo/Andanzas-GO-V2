import { LearnEntry } from '../types';
import { learningData } from '../data/learning';
import { supabase } from '../lib/supabaseClient';

class LearningService {
    async getAll(): Promise<LearnEntry[]> {
        try {
            const { data, error } = await supabase
                .from('learn_entries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase error fetching learn_entries:", error);
                return learningData; // Fallback to local data
            }

            if (!data || data.length === 0) {
                return learningData;
            }

            return data as LearnEntry[];
        } catch (error) {
            console.error("Failed to fetch learn_entries:", error);
            return learningData; // Fallback
        }
    }

    async getById(id: string): Promise<LearnEntry | undefined> {
        try {
            const { data, error } = await supabase
                .from('learn_entries')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                return learningData.find(e => e.id === id);
            }

            return data as LearnEntry;
        } catch (error) {
            return learningData.find(e => e.id === id);
        }
    }

    async getByCity(city: string): Promise<LearnEntry[]> {
        const all = await this.getAll();
        return all.filter(e => e.city.toLowerCase() === city.toLowerCase());
    }
    async create(entry: Omit<LearnEntry, 'id' | 'created_at'>): Promise<LearnEntry | null> {
        try {
            const { data, error } = await supabase
                .from('learn_entries')
                .insert([entry])
                .select()
                .single();
            if (error) throw error;
            return data as LearnEntry;
        } catch (error) {
            console.error("Error creating learn entry:", error);
            return null;
        }
    }

    async update(id: string, updates: Partial<LearnEntry>): Promise<LearnEntry | null> {
        try {
            const { data, error } = await supabase
                .from('learn_entries')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as LearnEntry;
        } catch (error) {
            console.error("Error updating learn entry:", error);
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('learn_entries')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting learn entry:", error);
            return false;
        }
    }
}

export const learningService = new LearningService();
