-- Sponsor a Mile - Database Schema
-- For Neon PostgreSQL

-- Runners table
CREATE TABLE runners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  event_name VARCHAR(255),
  event_date DATE,
  photo_url TEXT,
  donation_url TEXT,
  goal_amount DECIMAL(10,2) DEFAULT 943.20,
  price_per_mile DECIMAL(10,2) DEFAULT 36.00,
  slug VARCHAR(100) UNIQUE NOT NULL,
  total_miles DECIMAL(5,2) DEFAULT 26.2,
  mile_increment DECIMAL(4,2) DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Migration: Add columns if upgrading existing DB
-- ALTER TABLE runners ADD COLUMN IF NOT EXISTS mile_increment DECIMAL(4,2) DEFAULT 1.00;
-- ALTER TABLE runners ADD COLUMN IF NOT EXISTS donation_url TEXT;
-- ALTER TABLE runners ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Mile sponsorships table
CREATE TABLE mile_sponsorships (
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  mile_number DECIMAL(5,2) NOT NULL,
  sponsor_name VARCHAR(255),
  sponsor_email VARCHAR(255),
  dedication TEXT,
  amount DECIMAL(10,2),
  transaction_id VARCHAR(255),
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(runner_id, mile_number)
);

-- Index for faster lookups
CREATE INDEX idx_sponsorships_runner ON mile_sponsorships(runner_id);
CREATE INDEX idx_runners_slug ON runners(slug);

-- Sample seed data
INSERT INTO runners (name, event_name, event_date, slug, photo_url)
VALUES ('Alex Runner', 'NYC Half Marathon', '2025-03-16', 'alex-nyc-half', '/placeholder-runner.jpg');

-- Sample sponsorships (leaving most miles open for visual contrast)
INSERT INTO mile_sponsorships (runner_id, mile_number, sponsor_name, sponsor_email, dedication, amount, is_anonymous) VALUES
(1, 1, 'Mom & Dad', 'parents@example.com', 'We are so proud of you!', 36.00, false),
(1, 5, 'Sarah K.', 'sarah@example.com', 'For my kids - Maya and Eli', 36.00, false),
(1, 13.1, 'Anonymous', 'donor@example.com', 'The halfway point - one step at a time', 36.00, true),
(1, 18, 'David M.', 'david@example.com', 'In memory of Grandma Rose', 36.00, false),
(1, 26.2, 'Rachel B.', 'rachel@example.com', 'For everyone who did not give up', 36.00, false);
