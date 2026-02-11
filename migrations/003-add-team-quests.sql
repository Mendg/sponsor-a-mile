-- Create team_quests table for weekly collective goals
CREATE TABLE IF NOT EXISTS team_quests (
  id SERIAL PRIMARY KEY,
  week_number INTEGER NOT NULL,
  quest_name VARCHAR(255) NOT NULL,
  quest_type VARCHAR(50) NOT NULL, -- 'fundraising', 'completion', 'shares'
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reward_points INTEGER DEFAULT 50,
  reward_badge VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(week_number)
);

-- Create quest_participants table (tracks who contributed)
CREATE TABLE IF NOT EXISTS quest_participants (
  id SERIAL PRIMARY KEY,
  quest_id INTEGER REFERENCES team_quests(id) ON DELETE CASCADE,
  runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
  contribution_value DECIMAL(10,2) DEFAULT 0,
  participated BOOLEAN DEFAULT FALSE,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(quest_id, runner_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_quests_week ON team_quests(week_number);
CREATE INDEX IF NOT EXISTS idx_team_quests_active ON team_quests(is_completed, end_date);
CREATE INDEX IF NOT EXISTS idx_quest_participants_quest ON quest_participants(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_participants_runner ON quest_participants(runner_id);

-- Seed the 4 weekly quests for NYC Half 2026 program
-- Week 1: Feb 15-21, 2026
INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (
  1,
  'The $25,000 Dragon',
  'fundraising',
  25000.00,
  '2026-02-15',
  '2026-02-21',
  50,
  'Dragon Slayer'
) ON CONFLICT (week_number) DO NOTHING;

-- Week 2: Feb 22-28, 2026
INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (
  2,
  'The Completion Monster',
  'completion',
  95.00, -- 95% daily completion rate
  '2026-02-22',
  '2026-02-28',
  50,
  'Consistency Champion'
) ON CONFLICT (week_number) DO NOTHING;

-- Week 3: Mar 1-7, 2026
INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (
  3,
  'The Share Golem',
  'shares',
  100.00, -- 100 total shares
  '2026-03-01',
  '2026-03-07',
  50,
  'Viral Warrior'
) ON CONFLICT (week_number) DO NOTHING;

-- Week 4: Mar 8-14, 2026
INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (
  4,
  'The Final Challenge',
  'fundraising',
  35000.00,
  '2026-03-08',
  '2026-03-14',
  100,
  'Ultimate Champion'
) ON CONFLICT (week_number) DO NOTHING;

-- Comments
COMMENT ON TABLE team_quests IS 'Weekly collective goals for the coaching program';
COMMENT ON TABLE quest_participants IS 'Tracks which runners contributed to each quest';
