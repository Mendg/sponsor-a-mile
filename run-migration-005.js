require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Creating high_fives table...');
  await sql`CREATE TABLE IF NOT EXISTS high_fives (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(sender_id, recipient_id, (created_at::date))
  )`;

  console.log('Creating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_sender ON high_fives(sender_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_recipient ON high_fives(recipient_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_created ON high_fives(created_at)`;

  console.log('✓ High-fives migration completed successfully');
}

run().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
