import { body } from 'express-validator';

/**
 * Validation rules for the contact form submission endpoint.
 * - name: required, 2–100 characters, trimmed and HTML-escaped
 * - email: valid email format, normalized
 * - message: required, 10–2000 characters, trimmed and HTML-escaped
 */
export const contactValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .trim()
    .escape(),
];
