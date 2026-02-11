-- Coaching Engine Schema Migration
-- Run against existing Neon PostgreSQL database

-- Add coaching columns to runners table
ALTER TABLE runners ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE runners ADD COLUMN IF NOT EXISTS coaching_token VARCHAR(64);
ALTER TABLE runners ADD COLUMN IF NOT EXISTS coaching_active BOOLEAN DEFAULT FALSE;
ALTER TABLE runners ADD COLUMN IF NOT EXISTS neon_fundraise_url TEXT;

-- Unique index on coaching token for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_runners_coaching_token ON runners(coaching_token) WHERE coaching_token IS NOT NULL;

-- Coaching days: 24 rows of daily content
CREATE TABLE IF NOT EXISTS coaching_days (
  id SERIAL PRIMARY KEY,
  day_number INTEGER NOT NULL UNIQUE,
  calendar_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  sms_text TEXT NOT NULL,
  lesson TEXT NOT NULL,
  action_prompt TEXT NOT NULL,
  templates TEXT,
  easy_mode_prompt TEXT,
  easy_mode_templates TEXT,
  phase VARCHAR(50) NOT NULL DEFAULT 'foundation',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_days_date ON coaching_days(calendar_date);

-- Coaching progress: per-runner per-day completion
CREATE TABLE IF NOT EXISTS coaching_progress (
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  easy_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(runner_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_coaching_progress_runner ON coaching_progress(runner_id);

-- Coaching donations: donation events from Neon Fundraise
CREATE TABLE IF NOT EXISTS coaching_donations (
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  transaction_id VARCHAR(255),
  source VARCHAR(50) DEFAULT 'neon_fundraise',
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_donations_runner ON coaching_donations(runner_id);
CREATE INDEX IF NOT EXISTS idx_coaching_donations_txn ON coaching_donations(transaction_id);

-- Coaching activity feed
CREATE TABLE IF NOT EXISTS coaching_activity (
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  detail TEXT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_activity_runner ON coaching_activity(runner_id);
CREATE INDEX IF NOT EXISTS idx_coaching_activity_created ON coaching_activity(created_at DESC);

-- SMS log for delivery tracking
CREATE TABLE IF NOT EXISTS coaching_sms_log (
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL,
  to_phone VARCHAR(20) NOT NULL,
  body TEXT NOT NULL,
  twilio_sid VARCHAR(64),
  status VARCHAR(20) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_sms_runner ON coaching_sms_log(runner_id);
