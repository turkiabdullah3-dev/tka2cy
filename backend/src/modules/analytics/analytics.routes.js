import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getAnalyticsSummary, getAnalyticsEvents } from './analytics.service.js';

const router = Router();

// All analytics routes require authentication
router.use(requireAuth);

/**
 * GET /api/analytics/summary
 * Returns KPIs and aggregated analytics data for the admin dashboard.
 */
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await getAnalyticsSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/events
 * Returns a paginated list of raw analytics events.
 * Query params: page, limit, event_type, page (event page filter)
 */
router.get('/events', async (req, res, next) => {
  try {
    const { page, limit, event_type, page: eventPageFilter } = req.query;
    const result = await getAnalyticsEvents({
      page,
      limit,
      event_type,
      page: eventPageFilter,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
