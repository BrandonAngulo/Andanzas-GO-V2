import { supabase } from '../lib/supabaseClient';
import { InstitutionalContent } from '../types';

export const institutionalService = {
    async getAllContent(): Promise<InstitutionalContent[]> {
        const { data, error } = await supabase
            .from('institutional_content')
            .select('*');
        
        if (error) {
            console.error('Error fetching institutional content:', error);
            return [];
        }
        return data as InstitutionalContent[];
    },

    async updateContent(id: string, content_text: string): Promise<boolean> {
        const { error } = await supabase
            .from('institutional_content')
            .update({ 
                content_text,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error(`Error updating institutional content ${id}:`, error);
            return false;
        }
        return true;
    }
};
