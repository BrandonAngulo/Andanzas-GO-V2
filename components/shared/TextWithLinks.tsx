import React from 'react';
import { Site } from '../../types';

interface TextWithLinksProps {
  text: string;
  sites: Site[];
  onNavigate: (siteId: string) => void;
}

export const TextWithLinks: React.FC<TextWithLinksProps> = ({ text, sites, onNavigate }) => {
  if (!text) return null;

  // Filter out sites with empty names just in case
  const validSites = sites.filter(s => s.nombre && s.nombre.trim().length > 3);
  
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
