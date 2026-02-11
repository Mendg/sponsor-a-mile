-- Add points columns to runners table
ALTER TABLE runners
  ADD COLUMN IF NOT EXISTS points_balance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_lifetime INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_this_week INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_points_earned_at TIMESTAMP;

-- Create points_log table for tracking point history
CREATE TABLE IF NOT EXISTS points_log (
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  points_reason VARCHAR(255) NOT NULL, -- 'daily_completion', 'share', 'donation', etc.
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_points_log_runner ON points_log(runner_id);
CREATE INDEX IF NOT EXISTS idx_points_log_created ON points_log(created_at);

-- Comments
COMMENT ON COLUMN runners.points_balance IS 'Current points balance (can be spent)';
COMMENT ON COLUMN runners.points_lifetime IS 'Total points earned ever';
COMMENT ON COLUMN runners.points_this_week IS 'Points earned this week (resets weekly)';
COMMENT ON TABLE points_log IS 'Audit log of all points earned';
