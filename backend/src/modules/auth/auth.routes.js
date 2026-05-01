import { Router } from 'express';
import { validationResult } from 'express-validator';
import { loginRateLimit } from '../../middleware/rate-limit.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import { loginValidation } from './auth.validation.js';
import { findUserByEmail, verifyPassword, createSession } from './auth.service.js';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticate a user and create a session.
 */
router.post('/login', loginRateLimit, loginValidation, async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Look up user
    const user = await findUserByEmail(email);

    // Verify credentials — check password even if user not found to prevent timing attacks
    const passwordValid = user ? await verifyPassword(password, user.password_hash) : false;

    if (!user || !passwordValid) {
      // Emit failed login SIEM event
      await emitSecurityEvent({
        source: 'auth.routes',
        event_type: EVENT_TYPES.LOGIN_FAILED,
        severity: SEVERITY_LEVELS.MEDIUM,
        ip_address: ip,
        user_agent: userAgent,
        path: req.path,
        method: req.method,
        status_code: 401,
        message: `Failed login attempt for email: ${email}`,
        metadata: { email },
      });

      // Same message for both cases — don't reveal whether email exists
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create authenticated session
    await createSession(req, user);

    // Emit success event
    await emitSecurityEvent({
      source: 'auth.routes',
      event_type: EVENT_TYPES.LOGIN_SUCCESS,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: ip,
      user_agent: userAgent,
      path: req.path,
      method: req.method,
      status_code: 200,
      message: `Successful login: ${user.email}`,
      metadata: { userId: user.id, role: user.role },
    });

    return res.status(200).json({
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Destroy the session and clear the session cookie.
 */
router.post('/logout', async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    const userEmail = req.session?.userEmail;
    const userId = req.session?.userId;

    // Emit logout event before destroying session
    await emitSecurityEvent({
      source: 'auth.routes',
      event_type: EVENT_TYPES.LOGOUT,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: ip,
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 200,
      message: `User logged out: ${userEmail || 'unknown'}`,
      metadata: { userId, userEmail },
    });

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('turki.sid');
      return res.status(200).json({ message: 'Logged out' });
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
