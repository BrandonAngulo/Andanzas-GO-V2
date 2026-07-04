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
}

export const learningService = new LearningService();
