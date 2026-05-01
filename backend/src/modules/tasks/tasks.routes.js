import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import { getTasks, createTask, updateTask, deleteTask } from './tasks.service.js';

const router = Router();

// All task routes require authentication
router.use(requireAuth);

const VALID_STATUSES = ['open', 'in_progress', 'completed', 'archived'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_CATEGORIES = ['career', 'learning', 'project', 'security', 'personal'];

const createValidation = [
  body('title').notEmpty().trim().isLength({ max: 255 }).withMessage('Title is required and must be under 255 chars'),
  body('description').optional({ nullable: true }).trim(),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  body('priority').optional().isIn(VALID_PRIORITIES).withMessage('Invalid priority'),
  body('category').optional().isIn(VALID_CATEGORIES).withMessage('Invalid category'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid date'),
];

const updateValidation = [
  param('id').isUUID().withMessage('Task ID must be a valid UUID'),
  body('title').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Title must be 1-255 chars'),
  body('description').optional({ nullable: true }).trim(),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  body('priority').optional().isIn(VALID_PRIORITIES).withMessage('Invalid priority'),
  body('category').optional().isIn(VALID_CATEGORIES).withMessage('Invalid category'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid date'),
];

/**
 * GET /api/tasks
 * List tasks with optional filters: status, priority, category.
 */
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, status, priority, category } = req.query;
    const result = await getTasks({ page, limit, status, priority, category });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tasks
 * Create a new task.
 */
router.post('/', createValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, description, status, priority, category, due_date } = req.body;
    const task = await createTask({ title, description, status, priority, category, due_date });

    emitSecurityEvent({
      source: 'tasks.routes',
      event_type: EVENT_TYPES.TASK_CREATED,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 201,
      message: `Task created: "${title}"`,
      metadata: { task_id: task.id, title, priority: task.priority, category: task.category },
    }).catch(() => {});

    return res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/tasks/:id
 * Update a task (any fields).
 */
router.patch('/:id', updateValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;
    const task = await updateTask(id, updates);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const isCompleted = updates.status === 'completed';
    const eventType = isCompleted ? EVENT_TYPES.TASK_COMPLETED : EVENT_TYPES.TASK_UPDATED;

    emitSecurityEvent({
      source: 'tasks.routes',
      event_type: eventType,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      status_code: 200,
      message: isCompleted ? `Task completed: "${task.title}"` : `Task updated: "${task.title}"`,
      metadata: { task_id: id, updates },
    }).catch(() => {});

    return res.json({ task });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID.
 */
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Task ID must be a valid UUID')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const task = await deleteTask(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      emitSecurityEvent({
        source: 'tasks.routes',
        event_type: EVENT_TYPES.TASK_DELETED,
        severity: SEVERITY_LEVELS.LOW,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        status_code: 200,
        message: `Task deleted: "${task.title}"`,
        metadata: { task_id: id, title: task.title },
      }).catch(() => {});

      return res.json({ deleted: true, task });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
