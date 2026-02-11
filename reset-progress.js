require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

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
