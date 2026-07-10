import React, { useState, useEffect } from 'react';
import { Review, UserProfile } from '../../../types';
import { reviewsService } from '../../../services/reviews.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Trash2, X, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from '../../ui/confirm-dialog';


interface UserReviewsModalProps {
    user: UserProfile;
    onClose: () => void;
}

export const UserReviewsModal: React.FC<UserReviewsModalProps> = ({ user, onClose }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadReviews();
    }, [user.id]);

    const loadReviews = async () => {
        setLoading(true);
        const data = await reviewsService.getByUserId(user.id);
        setReviews(data);
        setLoading(false);
    };

    const handleDelete = (reviewId: string) => {
        setDeleteId(reviewId);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            const success = await reviewsService.deleteReview(deleteId);
            if (success) {
                loadReviews();
            } else {
                alert('Hubo un error al eliminar la reseña.');
            }
            setDeleteId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <ConfirmDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Eliminar esta reseña?"
                description="Se eliminará por incumplir las normas de la comunidad."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-border">
                
                {/* Header */}
                <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Moderación de Reseñas
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Reseñas escritas por <span className="font-semibold text-foreground">{user.full_name || user.email}</span>
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Cargando reseñas...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            Este usuario no ha publicado reseñas.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <Card key={review.id} className="overflow-hidden border-l-4 border-l-blue-500 relative">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-yellow-500 font-bold">★ {review.rating}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(review.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm">{review.text}</p>
                                                {review.fotos && review.fotos.length > 0 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {review.fotos.map((foto, idx) => (
                                                            <img key={idx} src={foto} alt={`Foto reseña ${idx}`} className="w-16 h-16 rounded-lg object-cover" />
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                                    ID Sitio: {review.siteId}
                                                </div>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                                                onClick={() => handleDelete(review.id)}
                                                title="Eliminar Reseña"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
