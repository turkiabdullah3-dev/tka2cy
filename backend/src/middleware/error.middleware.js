import { emitSecurityEvent, getClientIp } from '../modules/siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../security/security.config.js';

/**
 * Global Express error handler.
 *
 * In production: returns a generic 500 with no details.
 * In development: returns error message and stack trace.
 * Always emits a SIEM server_error event.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Always log the full error server-side
  console.error('[ERROR]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: getClientIp(req),
  });

  // Emit SIEM event — fire and forget
  emitSecurityEvent({
    source: 'error.middleware',
    event_type: EVENT_TYPES.SERVER_ERROR,
    severity: SEVERITY_LEVELS.MEDIUM,
    ip_address: getClientIp(req),
    user_agent: req.headers['user-agent'],
    path: req.path,
    method: req.method,
    status_code: 500,
    message: isProduction ? 'Internal server error' : err.message,
    metadata: {
      errorName: err.name,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  }).catch(() => {});

  if (isProduction) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
}
