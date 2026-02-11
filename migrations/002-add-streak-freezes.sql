-- Add streak freeze columns to runners table
ALTER TABLE runners
  ADD COLUMN IF NOT EXISTS streak_freezes_available INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_freezes_earned INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_freezes_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_freeze_earned_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS last_freeze_used_at TIMESTAMP;

-- Add comments
COMMENT ON COLUMN runners.streak_freezes_available IS 'Number of streak freezes available to use (max 3)';
COMMENT ON COLUMN runners.streak_freezes_earned IS 'Total freezes earned (lifetime)';
COMMENT ON COLUMN runners.streak_freezes_used IS 'Total freezes used (lifetime)';
COMMENT ON COLUMN runners.last_freeze_earned_at IS 'Timestamp of most recent freeze earned';
COMMENT ON COLUMN runners.last_freeze_used_at IS 'Timestamp of most recent freeze used';
