import React from 'react';
import { Site } from '../../types';

interface TextWithLinksProps {
  text: string;
  sites: Site[];
  onNavigate: (siteId: string) => void;
  currentSiteId?: string;
  currentSiteName?: string;
}

export const TextWithLinks: React.FC<TextWithLinksProps> = ({ text, sites, onNavigate, currentSiteId, currentSiteName }) => {
  if (!text) return null;

  // Use the explicitly provided currentSiteName, or try to find it by ID
  const resolvedCurrentSiteName = currentSiteName?.toLowerCase().trim() || sites.find(s => s.id === currentSiteId)?.nombre?.toLowerCase().trim();

  // Filter out sites with empty names just in case, and exclude the current site
  const validSites = sites.filter(s => {
    const isSameId = currentSiteId && s.id === currentSiteId;
    const isSameName = resolvedCurrentSiteName && s.nombre?.toLowerCase().trim() === resolvedCurrentSiteName;
    return s.nombre && s.nombre.trim().length > 3 && !isSameId && !isSameName;
  });
  
  // Sort sites by name length descending to match longer names first (e.g. "Teatro Esquina Latina" before "Teatro")
  validSites.sort((a, b) => b.nombre.length - a.nombre.length);

  // Create an array of text segments and elements
  let elements: (React.ReactNode | string)[] = [text];

  for (const site of validSites) {
    const siteName = site.nombre;
    const escapedName = siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex chars
    // Only match full words (or preceded/followed by punctuation/spaces) to avoid matching parts of words
    const regex = new RegExp(`(?<=\\b|\\s|[.,;:-])${escapedName}(?=\\b|\\s|[.,;:-])`, 'gi');

    const newElements: (React.ReactNode | string)[] = [];

    for (const el of elements) {
      if (typeof el === 'string') {
        let match;
        let lastIndex = 0;
        
        // Use regex.exec to find all matches in the string
        let tempRegex = new RegExp(regex); // Reset regex state
        
        while ((match = tempRegex.exec(el)) !== null) {
          // Push preceding text
          if (match.index > lastIndex) {
            newElements.push(el.substring(lastIndex, match.index));
          }
          
          // Push the interactive link
          newElements.push(
            <span 
              key={`${site.id}-${match.index}`} 
              className="text-primary hover:underline cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(site.id);
              }}
            >
              {match[0]}
            </span>
          );
          
          lastIndex = tempRegex.lastIndex;
        }
        
        // Push remaining text
        if (lastIndex < el.length) {
          newElements.push(el.substring(lastIndex));
        }
      } else {
        newElements.push(el);
      }
    }
    
    elements = newElements;
  }

  return <>{elements}</>;
};
