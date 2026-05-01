import { emitSecurityEvent, getClientIp } from '../modules/siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../security/security.config.js';

/**
 * requireAuth middleware — protects routes that require an authenticated session.
 *
 * If the session does not contain a userId:
 *   - Emits a SIEM dashboard_access_denied event
 *   - Returns 401 with { error: 'Authentication required' }
 *
 * If authenticated:
 *   - Sets req.user with { id, email, role }
 *   - Calls next()
 */
export async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    // Emit SIEM event — do not await, fire and forget
    emitSecurityEvent({
      source: 'auth.middleware',
      event_type: EVENT_TYPES.DASHBOARD_ACCESS_DENIED,
      severity: SEVERITY_LEVELS.HIGH,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 401,
      message: `Unauthenticated access attempt to protected route: ${req.method} ${req.path}`,
      metadata: {
        originalUrl: req.originalUrl,
      },
    }).catch(() => {});

    return res.status(401).json({ error: 'Authentication required' });
  }

  req.user = {
    id: req.session.userId,
    email: req.session.userEmail,
    role: req.session.userRole,
  };

  next();
}
