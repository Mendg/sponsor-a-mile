// Run migration 002: Add streak freeze columns
const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HZ2NzBdw5XhL@ep-divine-flower-ah7ewqao-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function runMigration() {
  const sql = neon(DATABASE_URL);

  console.log('Running migration 002: Add streak freeze columns...');

  try {
    // Read migration file
    const migrationSQL = fs.readFileSync('./migrations/002-add-streak-freezes.sql', 'utf8');

    // Execute each statement separately
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 60)}...`);
      await sql(statement);
    }

    console.log('✓ Migration 002 completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
