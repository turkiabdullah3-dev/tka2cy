import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';
import pool, { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BCRYPT_ROUNDS = 12;

async function initDatabase() {
  console.log('[INIT] Starting database initialization...');

  // 1. Test connection
  try {
    await pool.query('SELECT NOW()');
    console.log('[INIT] Database connection successful.');
  } catch (err) {
    console.error('[INIT] Failed to connect to database:', err.message);
    process.exit(1);
  }

  // 2. Run schema
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

    // Split on statements but handle the ALTER TABLE carefully
    // Execute the full schema as a single transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Execute statements individually to handle IF NOT EXISTS properly
      const statements = schemaSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await client.query(statement);
      }

      await client.query('COMMIT');
      console.log('[INIT] Schema applied successfully.');
    } catch (err) {
      await client.query('ROLLBACK');
      // Constraint already exists errors are acceptable
      if (err.code === '42P07' || err.code === '42710' || err.code === '42P16') {
        console.log('[INIT] Schema objects already exist, skipping.');
      } else {
        console.error('[INIT] Schema error:', err.message);
        // Don't exit - some errors (like duplicate constraint) are expected on re-init
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[INIT] Failed to read schema file:', err.message);
    process.exit(1);
  }

  // 3. Create admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('[INIT] ADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Skipping admin user creation.');
  } else {
    try {
      // Check if admin already exists
      const existing = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);

      if (existing.rows.length > 0) {
        console.log(`[INIT] Admin user already exists: ${adminEmail}`);
      } else {
        const passwordHash = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);
        await query(
          'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
          [adminEmail, passwordHash, 'admin']
        );
        console.log(`[INIT] Admin user created: ${adminEmail}`);
      }
    } catch (err) {
      console.error('[INIT] Failed to create admin user:', err.message);
    }
  }

  console.log('[INIT] Database initialization complete.');
  await pool.end();
  process.exit(0);
}

initDatabase();
