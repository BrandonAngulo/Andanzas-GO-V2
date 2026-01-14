-- Add published/is_published columns to events to prevent 400 errors from legacy filters
ALTER TABLE events ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Ensure RLS allows reading these
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Events" ON events;
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
