import { supabase } from '../lib/supabaseClient';

export interface LegalDocument {
    id: string;
    document_type: 'privacy_policy' | 'terms_of_service' | 'community_guidelines' | 'accessibility_statement' | 'consent_text' | 'other';
    title: string;
    version: string;
    content_markdown: string;
    content_html?: string;
    language: string;
    status: 'draft' | 'review' | 'published' | 'scheduled' | 'archived';
    effective_date?: string;
    published_at?: string;
    archived_at?: string;
    requires_acceptance: boolean;
    requires_reacceptance: boolean;
    change_summary?: string;
    created_at: string;
    updated_at: string;
}

export interface UserLegalAcceptance {
    id: string;
    user_id: string;
    document_type: string;
    document_version: string;
    document_id: string;
    accepted_at: string;
}

export const legalService = {
    // --- Public methods ---
    async getPublishedDocument(documentType: string, language: string = 'es'): Promise<LegalDocument | null> {
        const { data, error } = await supabase
            .from('legal_documents')
            .select('*')
            .eq('document_type', documentType)
            .eq('language', language)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching published document:', error);
            return null;
        }
        return data as LegalDocument;
    },

    async getAllPublishedDocuments(language: string = 'es'): Promise<LegalDocument[]> {
        const { data, error } = await supabase
            .from('legal_documents')
            .select('*')
            .eq('language', language)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching published documents:', error);
            return [];
        }
        
        // We only want the latest published of each type
        const latestDocs = new Map<string, LegalDocument>();
        for (const doc of data) {
            if (!latestDocs.has(doc.document_type)) {
                latestDocs.set(doc.document_type, doc as LegalDocument);
            }
        }
        return Array.from(latestDocs.values());
    },

    async getUserAcceptances(userId: string): Promise<UserLegalAcceptance[]> {
        const { data, error } = await supabase
            .from('user_legal_acceptances')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user acceptances:', error);
            return [];
        }
        return data as UserLegalAcceptance[];
    },

    async acceptDocument(userId: string, documentId: string, documentType: string, documentVersion: string): Promise<boolean> {
        const { error } = await supabase
            .from('user_legal_acceptances')
            .insert({
                user_id: userId,
                document_id: documentId,
                document_type: documentType,
                document_version: documentVersion
            });

        if (error) {
            console.error('Error accepting document:', error);
            return false;
        }
        return true;
    },

    async checkPendingMandatoryAcceptances(userId: string): Promise<LegalDocument[]> {
        const publishedDocs = await this.getAllPublishedDocuments();
        const mandatoryDocs = publishedDocs.filter(doc => doc.requires_reacceptance);
        
        if (mandatoryDocs.length === 0) return [];

        const userAcceptances = await this.getUserAcceptances(userId);
        
        const pendingDocs = mandatoryDocs.filter(doc => {
            return !userAcceptances.some(acc => acc.document_id === doc.id);
        });

        return pendingDocs;
    },

    // --- Admin methods ---
    async getAllDocumentsAdmin(): Promise<LegalDocument[]> {
        const { data, error } = await supabase
            .from('legal_documents')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as LegalDocument[];
    },

    async createDocument(doc: Partial<LegalDocument>): Promise<LegalDocument> {
        const { data: user } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('legal_documents')
            .insert({
                ...doc,
                created_by: user.user?.id,
                updated_by: user.user?.id
            })
            .select()
            .single();

        if (error) throw error;
        return data as LegalDocument;
    },

    async updateDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
        const { data: user } = await supabase.auth.getUser();
        
        // If changing status to published, set published_at
        if (updates.status === 'published' && !updates.published_at) {
            updates.published_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('legal_documents')
            .update({
                ...updates,
                updated_by: user.user?.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as LegalDocument;
    }
};
