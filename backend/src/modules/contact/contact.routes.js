import { Router } from 'express';
import { validationResult } from 'express-validator';
import { contactRateLimit } from '../../middleware/rate-limit.middleware.js';
import { emitSecurityEvent, getClientIp } from '../siem/siem.service.js';
import { EVENT_TYPES, SEVERITY_LEVELS } from '../../security/security.config.js';
import { contactValidation } from './contact.validation.js';
import { saveContactMessage } from './contact.service.js';

const router = Router();

/**
 * POST /api/public/contact  (also aliased at /api/contact)
 * Accept and persist a contact form submission.
 */
router.post('/', contactRateLimit, contactValidation, async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Persist to database
    await saveContactMessage({ name, email, message, ip_address: ip, user_agent: userAgent });

    // Emit SIEM event
    await emitSecurityEvent({
      source: 'contact.routes',
      event_type: EVENT_TYPES.CONTACT_FORM_SUBMIT,
      severity: SEVERITY_LEVELS.INFO,
      ip_address: ip,
      user_agent: userAgent,
      path: req.path,
      method: req.method,
      status_code: 201,
      message: `Contact form submitted by ${name} <${email}>`,
      metadata: { name, email },
    });

    return res.status(201).json({ message: 'Message received. Thank you.' });
  } catch (err) {
    next(err);
  }
});

export default router;
