import { useState, useMemo } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useI18n } from '../i18n';
import { getTranslated } from '../lib/utils';
import { Site, Evento } from '../types';

export const useSearchFilter = () => {
    const { sites, eventos } = useAppData();
    const { language } = useI18n();

    const [query, setQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minRating, setMinRating] = useState(0);
    const [showAccessibilityOnly, setShowAccessibilityOnly] = useState(false);

    // Derived: All available categories
    const allCategories = useMemo(() => {
        const categories = new Set(sites.map(s => getTranslated(s, 'tipo', language) as string));
        return Array.from(categories).sort();
    }, [language, sites]);

    // Derived: Filtered Results
    const results = useMemo(() => {
        let filtered = !query
            ? sites
            : sites.filter((s) => `${getTranslated(s, 'nombre', language)} ${getTranslated(s, 'tipo', language)}`.toLowerCase().includes(query.trim().toLowerCase()));

        // Filter by Categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(s => selectedCategories.includes(getTranslated(s, 'tipo', language) as string));
        }

        // Filter by Rating
        if (minRating > 0) {
            filtered = filtered.filter(s => s.rating >= minRating);
        }

        // Filter by Accessibility
        if (showAccessibilityOnly) {
            filtered = filtered.filter(s => s.accessibility_features && s.accessibility_features.length > 0);
        }

        return filtered;
    }, [query, selectedCategories, language, minRating, showAccessibilityOnly, sites]);

    // Actions
    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (checked) newSet.add(category); else newSet.delete(category);
            return Array.from(newSet);
        });
    };

    const clearFilters = () => {
        setQuery("");
        setSelectedCategories([]);
        setMinRating(0);
        setShowAccessibilityOnly(false);
    };

    return {
        query, setQuery,
        selectedCategories, setSelectedCategories,
        minRating, setMinRating,
        showAccessibilityOnly, setShowAccessibilityOnly,
        allCategories,
        results,
        handleCategoryChange,
        clearFilters
    };
};
