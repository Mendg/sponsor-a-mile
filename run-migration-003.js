require('dotenv').config();
// Run migration 003: Add team quests
const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HZ2NzBdw5XhL@ep-divine-flower-ah7ewqao-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function runMigration() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Running migration 003: Add team quests...');

  try {
    const migrationSQL = fs.readFileSync('./migrations/003-add-team-quests.sql', 'utf8');

    // Split statements and execute individually
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      // Skip COMMENT statements for now
      if (statement.toUpperCase().startsWith('COMMENT')) {
        console.log('Skipping COMMENT statement');
        continue;
      }

      const preview = statement.substring(0, 80).replace(/\n/g, ' ');
      console.log(`Executing: ${preview}...`);

      try {
        await sql(statement);
      } catch (err) {
        // Ignore "already exists" errors
        if (err.message.includes('already exists')) {
          console.log('  (already exists, skipping)');
        } else {
          throw err;
        }
      }
    }

    console.log('✓ Migration 003 completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
