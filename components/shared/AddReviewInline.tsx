import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import StarRating from './StarRating';
import { Site } from '../../types';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface AddReviewInlineProps {
  site: Site;
  onSubmit: (siteId: string, text: string, rating: number, files: File[]) => void;
}

const AddReviewInline: React.FC<AddReviewInlineProps> = ({ site, onSubmit }) => {
  const { t, language } = useI18n();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // 1. Submit data
    onSubmit(site.id, text, rating, Array.from(files));

    // 2. Show success state
    setIsSubmitted(true);

    // 3. Reset and close after delay
    setTimeout(() => {
      setOpen(false);
      // Reset form state after closing animation
      setTimeout(() => {
        setIsSubmitted(false);
        setText("");
        setRating(0);
        setFiles([]);
      }, 300);
    }, 2000);
  };

  const siteName = getTranslated(site, 'nombre', language);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4 mr-1" /> {t('addReview.writeReview')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
              <CheckCircle className="h-10 w-10 stroke-[3px]" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">
                {language === 'es' ? '¡Reseña Guardada!' : 'Review Saved!'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                {language === 'es' ? 'Gracias por ayudar a la comunidad.' : 'Thanks for helping the community.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader><DialogTitle>{t('addReview.reviewFor', { siteName })}</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('addReview.rating')}</label>
                <StarRating value={rating} onChange={setRating} size="md" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('addReview.yourExperience')}</label>
                <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={600} placeholder={t('addReview.placeholder')} className="min-h-[100px]" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('addReview.photos')}</label>
                <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="cursor-pointer" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={rating === 0 || text.trim().length === 0} className="w-full sm:w-auto">{t('save')}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewInline;