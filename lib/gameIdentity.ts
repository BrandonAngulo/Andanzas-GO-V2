import { Game } from '../services/games.service';

export const TRIVIA_GO_GAME_ID = '81111111-1111-1111-1111-111111111111';
export const LEGACY_VALLE_GAME_ID = '83333333-3333-3333-3333-333333333333';

const normalize = (value?: string | null) => value?.trim().toLocaleLowerCase('es') || '';

export const isTriviaGo = (game: Pick<Game, 'id' | 'slug' | 'title'>) => {
    const slug = normalize(game.slug);
    const title = normalize(game.title);

    return game.id === TRIVIA_GO_GAME_ID
        || slug === 'trivia-go'
        || slug === 'trivia-cali'
        || title === 'trivia go'
        || title === 'trivia cali';
};

export const isLegacyValleStandalone = (game: Pick<Game, 'id' | 'slug'>) => (
    game.id === LEGACY_VALLE_GAME_ID
    || normalize(game.slug) === 'trivia-valle-cauca'
);

