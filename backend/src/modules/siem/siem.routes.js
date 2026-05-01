import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getEvents, getSummary, resolveEvent } from './siem.service.js';

const router = Router();

// All SIEM routes require authentication
router.use(requireAuth);

/**
 * GET /api/siem/events
 * Retrieve paginated, filtered security events.
 * Query params: page, limit, severity, event_type, status, source
 */
router.get('/events', async (req, res, next) => {
  try {
    const { page, limit, severity, event_type, status, source } = req.query;
    const result = await getEvents({ page, limit, severity, event_type, status, source });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/siem/summary
 * Retrieve dashboard summary of security events.
 */
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await getSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/siem/events/:id/resolve
 * Mark a security event as resolved.
 */
router.patch(
  '/events/:id/resolve',
  [
    param('id')
      .isUUID()
      .withMessage('Event ID must be a valid UUID'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const event = await resolveEvent(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({ event });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
