import { emitSecurityEvent, getClientIp } from '../modules/siem/siem.service.js';
import { SEVERITY_LEVELS } from '../security/security.config.js';

// Paths/patterns to skip logging (noise reduction)
const SKIP_PATHS = [
  '/api/public/telemetry', // High-volume analytics pings — handled in its own route
];

const SKIP_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.map'];

/**
 * Determine whether a request path is interesting enough to log to SIEM.
 * @param {string} path
 * @returns {boolean}
 */
function isInterestingPath(path) {
  if (SKIP_PATHS.includes(path)) return false;

  const ext = path.split('.').pop();
  if (SKIP_EXTENSIONS.includes(`.${ext}`)) return false;

  return true;
}

/**
 * siemRequestLogger middleware — logs interesting API requests to SIEM.
 *
 * This is intentionally non-blocking: it fires the SIEM event asynchronously
 * and immediately calls next() without waiting for the DB write.
 */
export function siemRequestLogger(req, res, next) {
  // Pass control immediately — never block the request
  next();

  // Only log interesting paths
  if (!isInterestingPath(req.path)) return;

  // After response finishes, emit the SIEM log
  res.on('finish', () => {
    const statusCode = res.statusCode;

    // Determine severity based on status code
    let severity = SEVERITY_LEVELS.INFO;
    if (statusCode >= 500) {
      severity = SEVERITY_LEVELS.MEDIUM;
    } else if (statusCode === 401 || statusCode === 403) {
      severity = SEVERITY_LEVELS.LOW;
    } else if (statusCode === 429) {
      severity = SEVERITY_LEVELS.LOW;
    }

    emitSecurityEvent({
      source: 'request.logger',
      event_type: 'http_request',
      severity,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: statusCode,
      message: `${req.method} ${req.path} → ${statusCode}`,
      metadata: {
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        originalUrl: req.originalUrl,
      },
    }).catch(() => {});
  });
}
