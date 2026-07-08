-- Modifying the GAMES table to match the new schema requirements
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('trivia', 'quiz', 'daily', 'guess', 'visual', 'matching', 'ordering')) DEFAULT 'trivia';
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('draft', 'review', 'published', 'paused', 'archived', 'coming_soon', 'scheduled')) DEFAULT 'draft';
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS cover_title TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS cover_subtitle TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS allow_retries BOOLEAN DEFAULT false;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS show_feedback BOOLEAN DEFAULT true;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS bonus_time_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS leaderboard_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS public_ranking_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update GAME_QUESTIONS
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'guess_by_clue', 'matching', 'ordering')) DEFAULT 'multiple_choice';
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS related_entry_id UUID;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS related_route_id UUID;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('draft', 'review', 'published', 'archived')) DEFAULT 'draft';
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
-- We had options and correct_index. The user asked for correct_answer JSONB. Let's add it.
ALTER TABLE public.game_questions ADD COLUMN IF NOT EXISTS correct_answer JSONB;

-- Update GAME_SESSIONS
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS game_version INTEGER DEFAULT 1;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS abandoned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS answered_questions INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS skipped_questions INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS timed_out_questions INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS wrong_answers INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS accuracy_percent NUMERIC DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS base_score INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS time_bonus_score INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS streak_bonus_score INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS penalty_score INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS total_time_ms INTEGER;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS total_correct_time_ms INTEGER;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS max_correct_streak INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS final_streak INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS hints_used INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS retries_used INTEGER DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS badge_id UUID;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS stamp_id UUID;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update GAME_ANSWERS
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS question_version INTEGER DEFAULT 1;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS question_order INTEGER DEFAULT 1;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS shown_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS answered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS time_to_answer_ms INTEGER;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS selected_answer JSONB;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS correct_answer_snapshot JSONB;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS question_snapshot JSONB;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS was_skipped BOOLEAN DEFAULT false;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS timed_out BOOLEAN DEFAULT false;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS used_hint BOOLEAN DEFAULT false;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS used_retry BOOLEAN DEFAULT false;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS points_possible INTEGER DEFAULT 0;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS time_bonus_points INTEGER DEFAULT 0;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS streak_bonus_points INTEGER DEFAULT 0;
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS answer_source TEXT DEFAULT 'normal';
ALTER TABLE public.game_answers ADD COLUMN IF NOT EXISTS server_received_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Fix Route Challenges (since we need to gamify routes with them)
CREATE TABLE IF NOT EXISTS public.route_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id TEXT REFERENCES public.routes(id) ON DELETE CASCADE,
    stop_id UUID, -- We might not strictly enforce FK to stop_id if not created yet
    challenge_type TEXT,
    prompt TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    points_reward INTEGER DEFAULT 10,
    required BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_route_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    route_id TEXT REFERENCES public.routes(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('saved', 'in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    abandoned_at TIMESTAMP WITH TIME ZONE,
    last_stop_id UUID,
    visited_stop_ids UUID[] DEFAULT ARRAY[]::UUID[],
    completed_challenge_ids UUID[] DEFAULT ARRAY[]::UUID[],
    progress_percent INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, route_id)
);

ALTER TABLE public.route_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_route_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view route challenges" ON public.route_challenges FOR SELECT USING (true);
CREATE POLICY "Admins can manage route challenges" ON public.route_challenges USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can manage own route progress" ON public.user_route_progress USING (auth.uid() = user_id);

