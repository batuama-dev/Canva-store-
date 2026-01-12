// backend/config/setup.js
const db = require('./database');

const setupDatabase = async () => {
  try {
    console.log('--- Database Setup: Checking required tables... ---');

    // 1. Check for 'action_type' ENUM
    const typeCheck = await db.query("SELECT 1 FROM pg_type WHERE typname = 'action_type'");
    if (typeCheck.rowCount === 0) {
      console.log("Database Setup: 'action_type' ENUM not found. Creating...");
      await db.query("CREATE TYPE action_type AS ENUM ('CREATE', 'UPDATE', 'DELETE');");
      console.log("Database Setup: 'action_type' ENUM created successfully.");
    } else {
      console.log("Database Setup: 'action_type' ENUM already exists.");
    }

    // 2. Check for 'activity_logs' table
    const tableCheck = await db.query("SELECT to_regclass('public.activity_logs')");
    if (tableCheck.rows[0].to_regclass === null) {
      console.log("Database Setup: 'activity_logs' table not found. Creating...");
      await db.query(`
        CREATE TABLE activity_logs (
            id SERIAL PRIMARY KEY,
            action_type action_type NOT NULL,
            entity_type VARCHAR(50) NOT NULL,
            entity_id INT NOT NULL,
            details TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await db.query('CREATE INDEX idx_activity_logs_entity ON activity_logs (entity_type, entity_id);');
      console.log("Database Setup: 'activity_logs' table and index created successfully.");
    } else {
      console.log("Database Setup: 'activity_logs' table already exists.");
    }

    console.log('--- Database Setup: Check complete. ---');

  } catch (error) {
    console.error('--- FATAL: Database setup failed ---');
    console.error(error);
    // Exit process if setup fails, as the app cannot run without it.
    process.exit(1);
  }
};

module.exports = setupDatabase;
