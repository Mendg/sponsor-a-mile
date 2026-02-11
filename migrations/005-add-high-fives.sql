-- Create high_fives table for peer encouragement
CREATE TABLE IF NOT EXISTS high_fives (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sender_id, recipient_id, created_at::date) -- Limit to 1 high-five per person per day
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_high_fives_sender ON high_fives(sender_id);
CREATE INDEX IF NOT EXISTS idx_high_fives_recipient ON high_fives(recipient_id);
CREATE INDEX IF NOT EXISTS idx_high_fives_created ON high_fives(created_at);

-- Comments
COMMENT ON TABLE high_fives IS 'Peer-to-peer encouragement system (🙌 Give High-Five button)';
