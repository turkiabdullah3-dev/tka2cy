import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { telemetryRateLimit } from '../../middleware/rate-limit.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import { recordAnalyticsEvent } from '../analytics/analytics.service.js';
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

const ALLOWED_ANALYTICS_EVENTS = [
  'page_view',
  'project_view',
  'cv_download',
  'contact_form_submit',
  'contact_click',
];

/**
 * POST /api/public/telemetry
 * Accept a front-end analytics ping and record to analytics_events table.
 * Body: { event_type, page, visitor_id, session_id, referrer, metadata }
 */
router.post(
  '/telemetry',
  telemetryRateLimit,
  [
    body('event_type')
      .notEmpty()
      .trim()
      .isIn(ALLOWED_ANALYTICS_EVENTS)
      .withMessage(`event_type must be one of: ${ALLOWED_ANALYTICS_EVENTS.join(', ')}`),
    body('page').optional({ nullable: true }).trim(),
    body('visitor_id').optional({ nullable: true }).trim().isLength({ max: 64 }),
    body('session_id').optional({ nullable: true }).trim().isLength({ max: 64 }),
    body('referrer').optional({ nullable: true }).trim(),
    body('metadata').optional().isObject().withMessage('metadata must be an object'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { event_type, page, visitor_id, session_id, referrer, metadata = {} } = req.body;

      await recordAnalyticsEvent({
        event_type,
        page: page || null,
        visitor_id: visitor_id || null,
        session_id: session_id || null,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        referrer: referrer || req.headers['referer'] || null,
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
 * Track a CV download event in both SIEM and analytics.
 */
router.get('/cv-download', async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    const ua = req.headers['user-agent'];
    const referer = req.headers['referer'] || null;

    emitSecurityEvent({
      source: 'public.routes',
      event_type: EVENT_TYPES.CV_DOWNLOAD,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: ip,
      user_agent: ua,
      path: req.path,
      method: req.method,
      status_code: 200,
      message: 'CV download tracked',
      metadata: { referer },
    }).catch(() => {});

    recordAnalyticsEvent({
      event_type: 'cv_download',
      page: '/cv',
      ip_address: ip,
      user_agent: ua,
      referrer: referer,
    }).catch(() => {});

    return res.status(200).json({ message: 'CV download tracked' });
  } catch (err) {
    next(err);
  }
});

export default router;
