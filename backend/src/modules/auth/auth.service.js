import bcrypt from 'bcrypt';
import { query } from '../../database/db.js';

/**
 * Find a user record by email address.
 * @param {string} email - Normalized email address
 * @returns {Promise<Object|null>} - User row or null if not found
 */
export async function findUserByEmail(email) {
  const result = await query(
    'SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Compare a plaintext password against a stored bcrypt hash.
 * @param {string} password - Plaintext password from the request
 * @param {string} hash - bcrypt hash stored in the database
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Create an authenticated session for a user.
 * Regenerates the session ID to prevent session fixation attacks.
 *
 * @param {import('express').Request} req
 * @param {{ id: string, email: string, role: string }} user
 * @returns {Promise<void>}
 */
export async function createSession(req, user) {
  return new Promise((resolve, reject) => {
    // Regenerate session ID before storing data — prevents session fixation
    req.session.regenerate((err) => {
      if (err) return reject(err);

      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;

      // Save immediately to ensure data is persisted before response
      req.session.save((saveErr) => {
        if (saveErr) return reject(saveErr);
        resolve();
      });
    });
  });
}
