// TaskMate Validation Middleware
// Centralized input validation for improved security and data integrity

const { body, param, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Chat message validation
const validateChatMessage = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('chatHistory')
    .optional()
    .isArray()
    .withMessage('Chat history must be an array'),
  handleValidationErrors
];

// Task extraction validation
const validateTaskExtraction = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  handleValidationErrors
];

// Task completion validation
const validateTaskCompletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
  handleValidationErrors
];

// Mission creation validation
const validateMissionCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Mission title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Mission title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Mission description must be less than 1000 characters'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid ISO 8601 date'),
  handleValidationErrors
];

// Mission update validation
const validateMissionUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Mission ID must be a positive integer'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Mission title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Mission description must be less than 1000 characters'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'paused'])
    .withMessage('Status must be active, completed, or paused'),
  handleValidationErrors
];

module.exports = {
  validateChatMessage,
  validateTaskExtraction,
  validateTaskCompletion,
  validateMissionCreation,
  validateMissionUpdate,
  handleValidationErrors
}; 