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
  const statusCode = err.status || err.statusCode || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  // Always log the full error server-side
  console.error('[ERROR]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: getClientIp(req),
  });

  // Only emit SIEM for server errors, not expected client errors like 413
  if (!isClientError) {
    emitSecurityEvent({
      source: 'error.middleware',
      event_type: EVENT_TYPES.SERVER_ERROR,
      severity: SEVERITY_LEVELS.MEDIUM,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: statusCode,
      message: isProduction ? 'Internal server error' : err.message,
      metadata: {
        errorName: err.name,
        ...(isProduction ? {} : { stack: err.stack }),
      },
    }).catch(() => {});
  }

  // Client errors (4xx): always return the error message — no stack trace
  if (isClientError) {
    return res.status(statusCode).json({ error: err.message });
  }

  if (isProduction) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
}
