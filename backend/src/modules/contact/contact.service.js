import { query } from '../../database/db.js';

/**
 * Persist a contact form message to the database.
 *
 * @param {Object} opts
 * @param {string} opts.name        - Sender's name
 * @param {string} opts.email       - Sender's email address
 * @param {string} opts.message     - Message body
 * @param {string} [opts.ip_address] - Client IP address
 * @param {string} [opts.user_agent] - Client user agent string
 * @returns {Promise<Object>}        - The created contact_message row
 */
export async function saveContactMessage({ name, email, message, ip_address, user_agent }) {
  const result = await query(
    `INSERT INTO contact_messages (name, email, message, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, message, ip_address || null, user_agent || null]
  );
  return result.rows[0];
}
