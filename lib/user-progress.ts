export const USER_PROGRESS_UPDATED_EVENT = 'andanzas:user-progress-updated';

export interface UserProgressUpdatedDetail {
    source: 'daily_question' | 'daily_fact' | 'word_of_the_day' | 'weekly_goal' | 'game' | 'other';
}

/**
 * Invalida las copias locales de perfil, economía y progreso que pueden estar
 * montadas en paneles distintos. La base de datos sigue siendo la fuente de
 * verdad; este evento solo evita que la interfaz espere a una recarga completa.
 */
export const notifyUserProgressUpdated = (source: UserProgressUpdatedDetail['source']) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent<UserProgressUpdatedDetail>(USER_PROGRESS_UPDATED_EVENT, {
        detail: { source },
    }));
};

