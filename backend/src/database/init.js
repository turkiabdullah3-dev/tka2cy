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

    // Run each statement individually so a duplicate-object error on re-init
    // does not roll back the entire schema (e.g. new Phase 2 tables).
    const IGNORABLE_CODES = new Set(['42P07', '42710', '42P16']);

    const statements = schemaSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let applied = 0;
    let skipped = 0;
    for (const statement of statements) {
      try {
        await pool.query(statement);
        applied++;
      } catch (err) {
        if (IGNORABLE_CODES.has(err.code)) {
          skipped++;
        } else {
          console.error('[INIT] Schema statement error:', err.message, '\nStatement:', statement.slice(0, 80));
        }
      }
    }
    console.log(`[INIT] Schema applied: ${applied} statements executed, ${skipped} already existed.`);
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
