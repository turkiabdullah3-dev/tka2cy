import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DB] New client connected to PostgreSQL pool.');
  }
});

/**
 * Execute a parameterized query against the pool.
 * @param {string} text - SQL query string
 * @param {Array} [params] - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB] query executed in ${duration}ms | rows: ${result.rowCount}`);
    }
    return result;
  } catch (err) {
    console.error('[DB] Query error:', err.message);
    console.error('[DB] Query text:', text);
    throw err;
  }
}

/**
 * Acquire a client from the pool for use in transactions.
 * Caller is responsible for calling client.release().
 * @returns {Promise<pg.PoolClient>}
 */
export async function getClient() {
  const client = await pool.connect();
  const originalRelease = client.release.bind(client);

  // Wrap release to detect hung clients
  let released = false;
  client.release = () => {
    if (released) {
      console.warn('[DB] Client released more than once.');
      return;
    }
    released = true;
    client.release = originalRelease;
    return originalRelease();
  };

  return client;
}

export default pool;
