-- Add level column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Create point_logs table
CREATE TABLE IF NOT EXISTS point_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE point_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own logs
CREATE POLICY "Users can view own point logs" ON point_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Secure Point Awarding Function
CREATE OR REPLACE FUNCTION award_points(points_to_add INTEGER, reason_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_points INTEGER;
  new_points INTEGER;
  new_level INTEGER;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Log the transaction
  INSERT INTO point_logs (user_id, points, reason)
  VALUES (user_id, points_to_add, reason_text);

  -- Update Profile
  UPDATE profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = user_id
  RETURNING points INTO new_points;

  -- Calculate Level (Simple formula: 1 point = level 1, 100 points = level 2, etc.)
  new_level := floor(new_points / 100) + 1;

  UPDATE profiles
  SET level = new_level
  WHERE id = user_id;

  RETURN jsonb_build_object(
    'success', true,
    'new_points', new_points,
    'new_level', new_level
  );
END;
$$;
