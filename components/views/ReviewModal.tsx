import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Star } from 'lucide-react';
import StarRating from '../shared/StarRating';
import { Site } from '../../types';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface ReviewModalProps {
    site: Site | undefined;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (siteId: string, text: string, rating: number, files: File[]) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ site, isOpen, onClose, onSubmit }) => {
    const { t, language } = useI18n();
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [files, setFiles] = useState<File[]>([]);

    if (!site) return null;

    const handleSubmit = () => {
        onSubmit(site.id, text, rating, files);
        setText("");
        setRating(0);
        setFiles([]);
        onClose();
    };

    const handleSkip = () => {
        setText("");
        setRating(0);
        setFiles([]);
        onClose();
    };

    const siteName = getTranslated(site, 'nombre', language);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('addReview.reviewFor', { siteName })}</DialogTitle>
                    <DialogDescription>
                        {t('guidedRoute.reviewPrompt') || "¿Qué te pareció este lugar? Cuéntanos tu experiencia."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('addReview.rating')}</label>
                        <div className="flex justify-center p-2 bg-muted/20 rounded-lg">
                            <StarRating value={rating} onChange={setRating} size="md" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('addReview.yourExperience')}</label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={600}
                            placeholder={t('addReview.placeholder')}
                            className="min-h-[100px]"
                        />
                    </div>
                    {/* Simplified file input for now */}
                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium">{t('addReview.photos')}</label>
                        <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                    </div> */}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={handleSkip} className="w-full sm:w-auto">
                        {t('skip') || "Omitir"}
                    </Button>
                    <Button onClick={handleSubmit} disabled={rating === 0} className="w-full sm:w-auto">
                        {t('send')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
