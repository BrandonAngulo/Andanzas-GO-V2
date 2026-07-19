import { supabase } from '../lib/supabaseClient';
import { analyticsService } from './analytics.service';

export interface WeeklyGoal {
    key: string;
    title: string;
    description: string;
    target: number;
    reward_coins: number;
    progress: number;
    completed: boolean;
    claimed: boolean;
}

export interface WeeklyGoalsData {
    week_start: string;
    week_end: string;
    goals: WeeklyGoal[];
}

export const weeklyService = {
    async getWeeklyGoals(): Promise<WeeklyGoalsData> {
        const { data, error } = await supabase.rpc('get_weekly_goals');
        if (error) throw error;
        return data as WeeklyGoalsData;
    },

    async claimWeeklyGoal(goalKey: string): Promise<{ claimed?: boolean; coins?: number; already_claimed?: boolean }> {
        const { data, error } = await supabase.rpc('claim_weekly_goal', { p_goal_key: goalKey });
        if (error) throw error;
        const res = data as { claimed?: boolean; coins?: number; already_claimed?: boolean };
        if (res.claimed) analyticsService.trackEvent('weekly_goal_claimed', 'weekly', goalKey, { coins: res.coins ?? 0 });
        return res;
    },
};
