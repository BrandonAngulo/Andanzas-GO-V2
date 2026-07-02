import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { Site } from '../../types';
import { TextWithLinks } from './TextWithLinks';

interface ExpandableTextProps {
  text?: string;
  max?: number;
  sites?: Site[];
  currentSiteId?: string;
  currentSiteName?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text = "", max = 200, sites, currentSiteId, currentSiteName }) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > max;
  const shown = expanded || !isLong ? text : text.slice(0, max) + "…";
  return (
    <div className="leading-relaxed text-sm md:text-[15px]">
      <span>
        {sites && sites.length > 0 ? (
          <TextWithLinks 
            text={shown} 
            sites={sites} 
            onNavigate={(id) => { window.location.hash = `#/site/${id}`; }} 
            currentSiteId={currentSiteId}
            currentSiteName={currentSiteName}
          />
        ) : (
          shown
        )}
      </span>
      {isLong && (
        <button
          className="ml-2 underline text-primary hover:opacity-80"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t('seeLess') : t('seeMore')}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;