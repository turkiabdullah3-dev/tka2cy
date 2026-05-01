import rateLimit from 'express-rate-limit';
import { emitSecurityEvent, getClientIp } from '../modules/siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../security/security.config.js';

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOOPBACK_IPS = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

function skipLocalDevelopmentTraffic(req) {
  return isDevelopment && LOOPBACK_IPS.has(getClientIp(req));
}

/**
 * Build an onLimitReached handler that emits a SIEM event.
 * @param {string} limitName - Human-readable name for logging
 * @returns {Function}
 */
function buildRateLimitHandler(limitName) {
  return (req, res, next, options) => {
    emitSecurityEvent({
      source: 'rate-limit.middleware',
      event_type: EVENT_TYPES.RATE_LIMIT_TRIGGERED,
      severity: SEVERITY_LEVELS.LOW,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 429,
      message: `Rate limit triggered: ${limitName}`,
      metadata: {
        limitName,
        originalUrl: req.originalUrl,
      },
    }).catch(() => {});
  };
}

/**
 * loginRateLimit — 5 requests per 15 minutes per IP.
 * Applied to POST /api/auth/login.
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: skipLocalDevelopmentTraffic,
  message: { error: 'Too many login attempts' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    buildRateLimitHandler('loginRateLimit')(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * contactRateLimit — 3 requests per hour per IP.
 * Applied to contact form submissions.
 */
export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  skip: skipLocalDevelopmentTraffic,
  message: { error: 'Too many contact submissions' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    buildRateLimitHandler('contactRateLimit')(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * apiRateLimit — 100 requests per 15 minutes per IP.
 * General API rate limiter.
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: skipLocalDevelopmentTraffic,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    buildRateLimitHandler('apiRateLimit')(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * telemetryRateLimit — 200 requests per 15 minutes per IP.
 * For telemetry/analytics pings.
 */
export const telemetryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: skipLocalDevelopmentTraffic,
  message: { error: 'Too many telemetry requests' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    buildRateLimitHandler('telemetryRateLimit')(req, res, next, options);
    res.status(options.statusCode).json(options.message);
  },
});
