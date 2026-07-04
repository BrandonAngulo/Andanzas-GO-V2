import React from 'react';
import { LearnEntry } from '../../types';

interface TextWithLearnLinksProps {
  text: string;
  entries: LearnEntry[];
  onNavigate: (entry: LearnEntry) => void;
  currentEntryId?: string;
}

// Extract keywords from title to match in text
const getKeywordsForEntry = (title: string): string[] => {
    const t = title.toLowerCase();
    const keywords: string[] = [];
    
    if (t.includes('sucursal del cielo')) keywords.push('sucursal del cielo');
    if (t.includes('jovita')) keywords.push('jovita feijóo', 'jovita');
    if (t.includes('cholado')) keywords.push('cholado');
    if (t.includes('buziraco')) keywords.push('buziraco');
    if (t.includes(' vos ')) keywords.push('voseo');
    
    return keywords;
};

export const TextWithLearnLinks: React.FC<TextWithLearnLinksProps> = ({ text, entries, onNavigate, currentEntryId }) => {
  if (!text) return null;

  const currentKeywords = currentEntryId 
    ? getKeywordsForEntry(entries.find(e => e.id === currentEntryId)?.title || '') 
    : [];

  const validEntries = entries.filter(e => e.id !== currentEntryId);
  
  // Build a list of matchers: { keyword: string, entry: LearnEntry }
  const matchers: { keyword: string, entry: LearnEntry }[] = [];
  
  validEntries.forEach(entry => {
      const keywords = getKeywordsForEntry(entry.title);
      keywords.forEach(kw => {
          if (!currentKeywords.includes(kw)) {
              matchers.push({ keyword: kw, entry });
          }
      });
  });

  // Sort matchers by length descending to match longest phrases first
  matchers.sort((a, b) => b.keyword.length - a.keyword.length);

  let elements: (React.ReactNode | string)[] = [text];

  for (const matcher of matchers) {
    const keyword = matcher.keyword;
    // We want to match case insensitive, but only full words for short keywords like "Jovita"
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<=\\b|\\s|[.,;:-])${escapedKeyword}(?=\\b|\\s|[.,;:-]|s)`, 'gi'); // added 's' to allow plurals like cholados

    const newElements: (React.ReactNode | string)[] = [];

    for (const el of elements) {
      if (typeof el === 'string') {
        let match;
        let lastIndex = 0;
        let tempRegex = new RegExp(regex);
        
        while ((match = tempRegex.exec(el)) !== null) {
          if (match.index > lastIndex) {
            newElements.push(el.substring(lastIndex, match.index));
          }
          
          newElements.push(
            <span 
              key={`${matcher.entry.id}-${match.index}`} 
              className="text-primary hover:underline cursor-pointer font-semibold relative group"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(matcher.entry);
              }}
            >
              {match[0]}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Ver: {matcher.entry.title}
              </span>
            </span>
          );
          
          lastIndex = tempRegex.lastIndex;
        }
        
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
