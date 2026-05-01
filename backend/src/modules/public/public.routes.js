import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { telemetryRateLimit } from '../../middleware/rate-limit.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import { getProjects, getCyberLabs, getSkills } from './public.service.js';

const router = Router();

/**
 * GET /api/public/projects
 * Return the list of portfolio projects.
 */
router.get('/projects', (req, res) => {
  res.json({ projects: getProjects() });
});

/**
 * GET /api/public/cyber-labs
 * Return the list of cyber lab exercises.
 */
router.get('/cyber-labs', (req, res) => {
  res.json({ labs: getCyberLabs() });
});

/**
 * GET /api/public/skills
 * Return the grouped skills object.
 */
router.get('/skills', (req, res) => {
  res.json({ skills: getSkills() });
});

/**
 * POST /api/public/telemetry
 * Accept a front-end analytics ping and emit a SIEM info event.
 * Body: { event_type, path, metadata }
 */
router.post(
  '/telemetry',
  telemetryRateLimit,
  [
    body('event_type').notEmpty().withMessage('event_type is required').trim().escape(),
    body('path').optional().trim(),
    body('metadata').optional().isObject().withMessage('metadata must be an object'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { event_type, path: eventPath, metadata = {} } = req.body;

      await emitSecurityEvent({
        source: 'public.telemetry',
        event_type: `telemetry_${event_type}`,
        severity: SEVERITY_LEVELS.INFO,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        path: eventPath || req.path,
        method: req.method,
        status_code: 200,
        message: `Telemetry event: ${event_type}`,
        metadata,
      });

      return res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/public/cv-download
 * Track a CV download event in SIEM and return confirmation.
 */
router.get('/cv-download', async (req, res, next) => {
  try {
    await emitSecurityEvent({
      source: 'public.routes',
      event_type: EVENT_TYPES.CV_DOWNLOAD,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 200,
      message: 'CV download tracked',
      metadata: { referer: req.headers['referer'] || null },
    });

    return res.status(200).json({ message: 'CV download tracked' });
  } catch (err) {
    next(err);
  }
});

export default router;
