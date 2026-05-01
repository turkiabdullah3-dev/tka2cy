import { body } from 'express-validator';

/**
 * Validation rules for the login endpoint.
 * - email: must be a valid email, normalized to lowercase
 * - password: must not be empty, minimum 8 characters
 */
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];
