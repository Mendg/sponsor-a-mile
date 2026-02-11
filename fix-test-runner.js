require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Resetting test runner progress...');
  
  // Delete all progress for runner id 4 (mendel)
  await sql`DELETE FROM coaching_progress WHERE runner_id = 4`;
  
  // Reset points and freezes
  await sql`UPDATE runners SET
    points_balance = 0,
    points_lifetime = 0,
    points_this_week = 0,
    streak_freezes_available = 0,
    streak_freezes_earned = 0,
    streak_freezes_used = 0
  WHERE id = 4`;
  
  console.log('✓ Test runner reset - fresh start!');
}

run().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
