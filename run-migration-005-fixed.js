const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_HZ2NzBdw5XhL@ep-divine-flower-ah7ewqao-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function run() {
  console.log('Creating high_fives table...');
  await sql`CREATE TABLE IF NOT EXISTS high_fives (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
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
