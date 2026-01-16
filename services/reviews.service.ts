import { supabase } from '../lib/supabaseClient';
import { Review } from '../types';

export const reviewsService = {
    async getBySiteId(siteId: string): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('site_id', siteId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
        return data.map(mapReview);
    },

    async getAll(): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all reviews:', error);
            return [];
        }
        return data.map(mapReview);
    },

    async getByUserId(userId: string): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user reviews:', error);
            return [];
        }
        return data.map(mapReview);
    },

    async addReview(review: { siteId: string, text: string, rating: number, fotos: File[] }, userId: string): Promise<Review | null> {
        const photoUrls: string[] = [];

        if (review.fotos && review.fotos.length > 0) {
            for (const file of review.fotos) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    const filePath = `${userId}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('reviews')
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error('Error uploading file:', uploadError);
                        continue;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('reviews')
                        .getPublicUrl(filePath);

                    photoUrls.push(publicUrl);
                } catch (e) {
                    console.error("Exception uploading file", e);
                }
            }
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert({
                site_id: review.siteId,
                user_id: userId,
                text: review.text,
                rating: review.rating,
                photos: photoUrls
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding review:', error);
            return null;
        }
        return mapReview(data);
    },

    async deleteReview(reviewId: string): Promise<boolean> {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) {
            console.error('Error deleting review:', error);
            return false;
        }
        return true;
    }
};

function mapReview(dbReview: any): Review {
    return {
        id: dbReview.id,
        siteId: dbReview.site_id,
        text: dbReview.text,
        rating: dbReview.rating,
        fotos: dbReview.photos || [],
        createdAt: dbReview.created_at
    };
}
