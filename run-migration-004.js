const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_HZ2NzBdw5XhL@ep-divine-flower-ah7ewqao-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function run() {
  console.log('Adding points columns to runners...');
  await sql`ALTER TABLE runners
    ADD COLUMN IF NOT EXISTS points_balance INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS points_lifetime INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS points_this_week INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_points_earned_at TIMESTAMP`;

  console.log('Creating points_log table...');
  await sql`CREATE TABLE IF NOT EXISTS points_log (
    id SERIAL PRIMARY KEY,
    runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    points_reason VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  console.log('Creating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_points_log_runner ON points_log(runner_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_points_log_created ON points_log(created_at)`;

  console.log('✓ Points migration completed successfully');
}

run().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
