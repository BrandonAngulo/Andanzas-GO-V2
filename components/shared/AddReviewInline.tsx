import React, { useState } from 'react';
import { Star } from 'lucide-react';
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

  const handleSubmit = () => {
    onSubmit(site.id, text, rating, Array.from(files));
    setText("");
    setRating(0);
    setFiles([]);
    setOpen(false);
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
        <DialogHeader><DialogTitle>{t('addReview.reviewFor', { siteName })}</DialogTitle></DialogHeader>
        <div className="grid gap-2">
          <label className="text-sm">{t('addReview.rating')}</label>
          <StarRating value={rating} onChange={setRating} size="md" />
          <label className="text-sm">{t('addReview.yourExperience')}</label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={600} placeholder={t('addReview.placeholder')} />
          <label className="text-sm">{t('addReview.photos')}</label>
          <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{t('save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewInline;