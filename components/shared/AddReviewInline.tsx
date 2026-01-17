import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Site } from '../../types';
import { useI18n } from '../../i18n';
import ReviewModal from '../views/ReviewModal';

interface AddReviewInlineProps {
  site: Site;
  onSubmit: (siteId: string, text: string, rating: number, files: File[]) => void;
}

const AddReviewInline: React.FC<AddReviewInlineProps> = ({ site, onSubmit }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Star className="h-4 w-4 mr-1" /> {t('addReview.writeReview')}
      </Button>

      <ReviewModal
        site={site}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddReviewInline;