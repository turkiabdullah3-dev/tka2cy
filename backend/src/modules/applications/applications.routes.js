import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import {
  getApplications,
  getApplicationStats,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from './applications.service.js';

const router = Router();

router.use(requireAuth);

const VALID_STATUSES = [
  'saved', 'ready_to_apply', 'applied', 'screening',
  'interview', 'technical_task', 'offer', 'rejected', 'withdrawn',
];
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_SOURCES = ['manual', 'linkedin', 'company_site', 'email', 'referral', 'other'];

const createValidation = [
  body('company').notEmpty().trim().isLength({ max: 255 }).withMessage('Company is required'),
  body('job_title').notEmpty().trim().isLength({ max: 255 }).withMessage('Job title is required'),
  body('job_url').optional({ nullable: true }).trim().isLength({ max: 2048 }),
  body('location').optional({ nullable: true }).trim().isLength({ max: 255 }),
  body('source').optional().isIn(VALID_SOURCES).withMessage('Invalid source'),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  body('priority').optional().isIn(VALID_PRIORITIES).withMessage('Invalid priority'),
  body('job_description').optional({ nullable: true }).trim(),
  body('notes').optional({ nullable: true }).trim(),
  body('applied_at').optional({ nullable: true }).isISO8601().withMessage('applied_at must be a valid date'),
  body('follow_up_at').optional({ nullable: true }).isISO8601().withMessage('follow_up_at must be a valid date'),
];

const updateValidation = [
  param('id').isUUID().withMessage('Application ID must be a valid UUID'),
  body('company').optional().trim().isLength({ min: 1, max: 255 }),
  body('job_title').optional().trim().isLength({ min: 1, max: 255 }),
  body('job_url').optional({ nullable: true }).trim().isLength({ max: 2048 }),
  body('location').optional({ nullable: true }).trim().isLength({ max: 255 }),
  body('source').optional().isIn(VALID_SOURCES).withMessage('Invalid source'),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  body('priority').optional().isIn(VALID_PRIORITIES).withMessage('Invalid priority'),
  body('job_description').optional({ nullable: true }).trim(),
  body('notes').optional({ nullable: true }).trim(),
  body('applied_at').optional({ nullable: true }).isISO8601().withMessage('applied_at must be a valid date'),
  body('follow_up_at').optional({ nullable: true }).isISO8601().withMessage('follow_up_at must be a valid date'),
];

/**
 * GET /api/applications/stats
 * Aggregate counts for KPI cards.
 */
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getApplicationStats();
    res.json({ stats });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/applications
 * Paginated list with optional filters: status, priority, source, search.
 */
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, status, priority, source, search } = req.query;
    const result = await getApplications({ page, limit, status, priority, source, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/applications
 * Create a new application.
 */
router.post('/', createValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const application = await createApplication(req.body);

    emitSecurityEvent({
      source: 'applications.routes',
      event_type: EVENT_TYPES.APPLICATION_CREATED,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 201,
      message: `Application created: "${application.company}" — "${application.job_title}"`,
      metadata: {
        application_id: application.id,
        company: application.company,
        job_title: application.job_title,
      },
    }).catch(() => {});

    return res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/applications/:id
 */
router.get('/:id', [param('id').isUUID().withMessage('Application ID must be a valid UUID')], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const application = await getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ application });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/applications/:id
 */
router.patch('/:id', updateValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const existing = await getApplicationById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updates = req.body;
    const application = await updateApplication(id, updates);

    const isStatusChange = updates.status !== undefined && updates.status !== existing.status;
    const eventType = isStatusChange
      ? EVENT_TYPES.APPLICATION_STATUS_CHANGED
      : EVENT_TYPES.APPLICATION_UPDATED;

    emitSecurityEvent({
      source: 'applications.routes',
      event_type: eventType,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 200,
      message: isStatusChange
        ? `Application status changed: "${existing.company}" (${existing.status} → ${updates.status})`
        : `Application updated: "${existing.company}" — "${existing.job_title}"`,
      metadata: {
        application_id: id,
        company: existing.company,
        job_title: existing.job_title,
        old_status: isStatusChange ? existing.status : undefined,
        new_status: isStatusChange ? updates.status : undefined,
      },
    }).catch(() => {});

    return res.json({ application });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/applications/:id
 */
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Application ID must be a valid UUID')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const application = await deleteApplication(id);

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      emitSecurityEvent({
        source: 'applications.routes',
        event_type: EVENT_TYPES.APPLICATION_DELETED,
        severity: SEVERITY_LEVELS.LOW,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        status_code: 200,
        message: `Application deleted: "${application.company}" — "${application.job_title}"`,
        metadata: {
          application_id: id,
          company: application.company,
          job_title: application.job_title,
        },
      }).catch(() => {});

      return res.json({ deleted: true, application });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
