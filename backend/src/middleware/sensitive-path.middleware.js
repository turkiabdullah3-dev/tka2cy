import { emitSecurityEvent, getClientIp } from '../modules/siem/siem.service.js';
import { SENSITIVE_PATHS, EVENT_TYPES, SEVERITY_LEVELS } from '../security/security.config.js';

/**
 * detectSensitivePath middleware — detects and blocks requests to sensitive paths.
 *
 * Checks the request path against a known list of sensitive paths (exact match
 * or prefix match). If a match is found:
 *   - Emits a high-severity SIEM event (sensitive_path_scan)
 *   - Returns 404 to avoid revealing the path exists
 */
export async function detectSensitivePath(req, res, next) {
  const requestPath = req.path.toLowerCase();

  const matched = SENSITIVE_PATHS.some(
    (sensitivePath) =>
      requestPath === sensitivePath.toLowerCase() ||
      requestPath.startsWith(sensitivePath.toLowerCase() + '/')
  );

  if (matched) {
    // Emit SIEM event — fire and forget, don't delay response
    emitSecurityEvent({
      source: 'sensitive-path.middleware',
      event_type: EVENT_TYPES.SENSITIVE_PATH_SCAN,
      severity: SEVERITY_LEVELS.HIGH,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 404,
      message: `Sensitive path scan detected: ${req.method} ${req.path}`,
      metadata: {
        originalUrl: req.originalUrl,
        referer: req.headers['referer'] || null,
      },
    }).catch(() => {});

    return res.status(404).json({ error: 'Not found' });
  }

  next();
}
