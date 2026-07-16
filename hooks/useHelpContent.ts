import { useEffect, useState } from 'react';
import { helpService, HelpMap } from '../services/help.service';
import { useI18n } from '../i18n';

export interface ResolvedHelp {
    title: string;
    body: string;
}

/**
 * Loads the editable help texts (DB) once and resolves each key to a
 * `{ title, body }` for the current language, falling back to the in-code
 * i18n content (`panelInfo.*` / `economyHelp.*`) when the admin has not set
 * an override.
 */
export const useHelpContent = () => {
    const { t, language } = useI18n();
    const [map, setMap] = useState<HelpMap>({});

    useEffect(() => {
        let active = true;
        helpService.getMap().then(m => { if (active) setMap(m); });
        return () => { active = false; };
    }, []);

    const codeFallback = (key: string): ResolvedHelp => {
        if (key === 'economy') {
            const earn = (t('economyHelp.earn') as unknown as string[]) || [];
            const body = [
                t('economyHelp.intro'),
                '',
                `${t('economyHelp.levelTitle')}: ${t('economyHelp.levelBody')}`,
                '',
                `${t('economyHelp.pointsTitle')}: ${t('economyHelp.pointsBody')}`,
                '',
                `${t('economyHelp.coinsTitle')}: ${t('economyHelp.coinsBody')}`,
                '',
                t('economyHelp.earnTitle'),
                ...earn.map(e => `- ${e}`),
                '',
                `${t('economyHelp.soonLabel')}: ${t('economyHelp.soonBody')}`,
            ].join('\n');
            return { title: t('economyHelp.title'), body };
        }
        const paragraphs = (t(`panelInfo.${key}.body`) as unknown as string[]) || [];
        return {
            title: t(`panelInfo.${key}.title`),
            body: Array.isArray(paragraphs) ? paragraphs.join('\n\n') : String(paragraphs),
        };
    };

    const getHelp = (key: string): ResolvedHelp => {
        const fallback = codeFallback(key);
        const row = map[key];
        if (!row || row.is_active === false) return fallback;
        const title = (language === 'es' ? row.title_es : (row.title_en || row.title_es)) || '';
        const body = (language === 'es' ? row.body_es : (row.body_en || row.body_es)) || '';
        return {
            title: title.trim() ? title : fallback.title,
            body: body.trim() ? body : fallback.body,
        };
    };

    return { getHelp };
};
