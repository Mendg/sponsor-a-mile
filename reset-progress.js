const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_HZ2NzBdw5XhL@ep-divine-flower-ah7ewqao-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function run() {
  console.log('Resetting test runner progress...');
  
  // Delete all progress for runner id 4 (mendel)
  await sql`DELETE FROM coaching_progress WHERE runner_id = 4`;
  await sql`DELETE FROM points_log WHERE runner_id = 4`;
  
  console.log('✓ Test runner reset!');
}

run().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
