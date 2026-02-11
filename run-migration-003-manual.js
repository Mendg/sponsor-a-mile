require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Creating team_quests table...');
  await sql`CREATE TABLE IF NOT EXISTS team_quests (
    id SERIAL PRIMARY KEY,
    week_number INTEGER NOT NULL,
    quest_name VARCHAR(255) NOT NULL,
    quest_type VARCHAR(50) NOT NULL,
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
  )`;

  console.log('Creating quest_participants table...');
  await sql`CREATE TABLE IF NOT EXISTS quest_participants (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER REFERENCES team_quests(id) ON DELETE CASCADE,
    runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    contribution_value DECIMAL(10,2) DEFAULT 0,
    participated BOOLEAN DEFAULT FALSE,
    reward_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(quest_id, runner_id)
  )`;

  console.log('Creating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_team_quests_week ON team_quests(week_number)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_team_quests_active ON team_quests(is_completed, end_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quest_participants_quest ON quest_participants(quest_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quest_participants_runner ON quest_participants(runner_id)`;

  console.log('Seeding quests...');
  await sql`INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (1, 'The $25,000 Dragon', 'fundraising', 25000.00, '2026-02-15', '2026-02-21', 50, 'Dragon Slayer')
ON CONFLICT (week_number) DO NOTHING`;

  await sql`INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (2, 'The Completion Monster', 'completion', 95.00, '2026-02-22', '2026-02-28', 50, 'Consistency Champion')
ON CONFLICT (week_number) DO NOTHING`;

  await sql`INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (3, 'The Share Golem', 'shares', 100.00, '2026-03-01', '2026-03-07', 50, 'Viral Warrior')
ON CONFLICT (week_number) DO NOTHING`;

  await sql`INSERT INTO team_quests (week_number, quest_name, quest_type, target_value, start_date, end_date, reward_points, reward_badge)
VALUES (4, 'The Final Challenge', 'fundraising', 35000.00, '2026-03-08', '2026-03-14', 100, 'Ultimate Champion')
ON CONFLICT (week_number) DO NOTHING`;

  console.log('✓ Migration completed successfully');
}

run().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
