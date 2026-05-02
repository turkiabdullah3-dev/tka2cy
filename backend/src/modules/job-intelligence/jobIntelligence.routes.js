import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import {
  getAnalyses,
  getAnalysisById,
  createAnalysisDraft,
  updateAnalysisWithResult,
  markAnalysisFailed,
  updateAnalysis,
  deleteAnalysis,
} from './jobIntelligence.service.js';
import { runAnalysis, detectPromptInjection } from './ai.service.js';

const router = Router();
router.use(requireAuth);

const VALID_STATUSES = ['draft', 'analyzed', 'failed'];
const VALID_FIT_LEVELS = ['weak', 'moderate', 'strong', 'excellent'];
const VALID_RECOMMENDATIONS = ['apply', 'apply_after_cv_update', 'skip', 'save_for_later'];

/**
 * GET /api/job-intelligence/analyses
 * Paginated list with optional fit_level / recommendation / status filters.
 */
router.get('/analyses', async (req, res, next) => {
  try {
    const { page, limit, fit_level, recommendation, status } = req.query;

    if (fit_level && !VALID_FIT_LEVELS.includes(fit_level)) {
      return res.status(400).json({ error: 'Invalid fit_level filter' });
    }
    if (recommendation && !VALID_RECOMMENDATIONS.includes(recommendation)) {
      return res.status(400).json({ error: 'Invalid recommendation filter' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status filter' });
    }

    const result = await getAnalyses({ page, limit, fit_level, recommendation, status });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/job-intelligence/analyze
 * Create and immediately run an AI analysis.
 */
router.post(
  '/analyze',
  [
    body('job_description')
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 40000 })
      .withMessage('job_description is required (10–40000 characters)'),
    body('application_id')
      .optional({ nullable: true })
      .isUUID()
      .withMessage('application_id must be a valid UUID'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { job_description, application_id } = req.body;
      const hasInjectionSignal = detectPromptInjection(job_description);

      // 1. Create draft record
      const draft = await createAnalysisDraft(job_description, application_id || null);

      emitSecurityEvent({
        source: 'job-intelligence',
        event_type: EVENT_TYPES.JOB_ANALYSIS_CREATED,
        severity: SEVERITY_LEVELS.LOW,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        status_code: 202,
        message: `Job analysis created (id: ${draft.id})`,
        metadata: {
          analysis_id: draft.id,
          application_id: application_id || null,
        },
      }).catch(() => {});

      if (hasInjectionSignal) {
        emitSecurityEvent({
          source: 'job-intelligence',
          event_type: EVENT_TYPES.JOB_PROMPT_INJECTION_SIGNAL,
          severity: SEVERITY_LEVELS.MEDIUM,
          ip_address: getClientIp(req),
          user_agent: req.headers['user-agent'],
          path: req.path,
          method: req.method,
          status_code: 202,
          message: `Prompt injection signal detected in job description (analysis id: ${draft.id})`,
          metadata: {
            analysis_id: draft.id,
            application_id: application_id || null,
          },
        }).catch(() => {});
      }

      // 2. Run AI analysis
      let aiResult;
      try {
        aiResult = await runAnalysis(job_description);
      } catch (aiErr) {
        await markAnalysisFailed(draft.id);

        emitSecurityEvent({
          source: 'job-intelligence',
          event_type: EVENT_TYPES.JOB_ANALYSIS_FAILED,
          severity: SEVERITY_LEVELS.LOW,
          ip_address: getClientIp(req),
          user_agent: req.headers['user-agent'],
          path: req.path,
          method: req.method,
          status_code: 500,
          message: `Job analysis failed: ${aiErr.message}`,
          metadata: {
            analysis_id: draft.id,
            application_id: application_id || null,
          },
        }).catch(() => {});

        return res.status(500).json({
          error: 'AI analysis failed',
          detail: aiErr.message,
          analysis_id: draft.id,
        });
      }

      // 3. Store completed result
      const completed = await updateAnalysisWithResult(draft.id, {
        ...aiResult,
        prompt_injection_signal: hasInjectionSignal,
      });

      emitSecurityEvent({
        source: 'job-intelligence',
        event_type: EVENT_TYPES.JOB_ANALYSIS_COMPLETED,
        severity: SEVERITY_LEVELS.LOW,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        status_code: 201,
        message: `Job analysis completed — score: ${completed.match_score}, fit: ${completed.fit_level}, recommendation: ${completed.recommendation}`,
        metadata: {
          analysis_id: draft.id,
          application_id: application_id || null,
          match_score: completed.match_score,
          fit_level: completed.fit_level,
          recommendation: completed.recommendation,
        },
      }).catch(() => {});

      return res.status(201).json({ analysis: completed });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/job-intelligence/analyses/:id
 */
router.get(
  '/analyses/:id',
  [param('id').isUUID().withMessage('Analysis ID must be a valid UUID')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const analysis = await getAnalysisById(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }
      res.json({ analysis });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/job-intelligence/analyses/:id
 * Update mutable fields: status, recommendation, reasoning, application_id.
 */
router.patch(
  '/analyses/:id',
  [
    param('id').isUUID().withMessage('Analysis ID must be a valid UUID'),
    body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
    body('recommendation').optional().isIn(VALID_RECOMMENDATIONS).withMessage('Invalid recommendation'),
    body('reasoning').optional({ nullable: true }).trim().isLength({ max: 2000 }),
    body('application_id').optional({ nullable: true }).isUUID().withMessage('application_id must be a valid UUID'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const existing = await getAnalysisById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      const analysis = await updateAnalysis(id, req.body);
      return res.json({ analysis });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/job-intelligence/analyses/:id
 */
router.delete(
  '/analyses/:id',
  [param('id').isUUID().withMessage('Analysis ID must be a valid UUID')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const analysis = await deleteAnalysis(id);
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      emitSecurityEvent({
        source: 'job-intelligence',
        event_type: EVENT_TYPES.JOB_ANALYSIS_DELETED,
        severity: SEVERITY_LEVELS.LOW,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        status_code: 200,
        message: `Job analysis deleted (id: ${id})`,
        metadata: {
          analysis_id: id,
          application_id: analysis.application_id || null,
        },
      }).catch(() => {});

      return res.json({ deleted: true, analysis });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
