/**
 * Input Validation Utility
 * Centralized validation schemas and middleware
 */

const { logger } = require('./logger');

/**
 * Common validation patterns
 */
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  objectId: /^[0-9a-fA-F]{24}$/,
  url: /^https?:\/\/[^\s$.?#].[^\s]*$/,
  phone: /^\+?[\d\s\-\(\)]{10,15}$/,
};

/**
 * Validation error class
 */
class ValidationError extends Error {
  constructor(message, field = null, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.status = 400;
  }
}

/**
 * Sanitize string input
 */
function sanitizeString(str, options = {}) {
  if (typeof str !== 'string') return str;

  const { trim = true, lowercase = false, removeSpecialChars = false, maxLength = 1000 } = options;

  let sanitized = str;

  if (trim) sanitized = sanitized.trim();
  if (lowercase) sanitized = sanitized.toLowerCase();
  if (removeSpecialChars) sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, '');
  if (sanitized.length > maxLength) sanitized = sanitized.substring(0, maxLength);

  return sanitized;
}

/**
 * Validate email format
 */
function validateEmail(email, required = true) {
  if (!email) {
    if (required) throw new ValidationError('Email is required', 'email');
    return null;
  }

  const sanitized = sanitizeString(email, { trim: true, lowercase: true });

  if (!PATTERNS.email.test(sanitized)) {
    throw new ValidationError('Invalid email format', 'email', sanitized);
  }

  return sanitized;
}

/**
 * Validate password strength
 */
function validatePassword(password, options = {}) {
  const {
    required = true,
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password) {
    if (required) throw new ValidationError('Password is required', 'password');
    return null;
  }

  if (password.length < minLength) {
    throw new ValidationError(`Password must be at least ${minLength} characters long`, 'password');
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    throw new ValidationError('Password must contain at least one uppercase letter', 'password');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    throw new ValidationError('Password must contain at least one lowercase letter', 'password');
  }

  if (requireNumbers && !/\d/.test(password)) {
    throw new ValidationError('Password must contain at least one number', 'password');
  }

  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    throw new ValidationError('Password must contain at least one special character', 'password');
  }

  return password;
}

/**
 * Validate ObjectId format
 */
function validateObjectId(id, fieldName = 'id', required = true) {
  if (!id) {
    if (required) throw new ValidationError(`${fieldName} is required`, fieldName);
    return null;
  }

  if (!PATTERNS.objectId.test(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`, fieldName, id);
  }

  return id;
}

/**
 * Validate enum values
 */
function validateEnum(value, allowedValues, fieldName, required = true) {
  if (!value) {
    if (required) throw new ValidationError(`${fieldName} is required`, fieldName);
    return null;
  }

  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      fieldName,
      value
    );
  }

  return value;
}

/**
 * Validate array input
 */
function validateArray(arr, fieldName, options = {}) {
  const { required = true, minLength = 0, maxLength = 100, itemValidator = null } = options;

  if (!arr) {
    if (required) throw new ValidationError(`${fieldName} is required`, fieldName);
    return null;
  }

  if (!Array.isArray(arr)) {
    throw new ValidationError(`${fieldName} must be an array`, fieldName);
  }

  if (arr.length < minLength) {
    throw new ValidationError(`${fieldName} must have at least ${minLength} items`, fieldName);
  }

  if (arr.length > maxLength) {
    throw new ValidationError(`${fieldName} cannot have more than ${maxLength} items`, fieldName);
  }

  if (itemValidator) {
    return arr.map((item, index) => {
      try {
        return itemValidator(item);
      } catch (error) {
        throw new ValidationError(
          `${fieldName}[${index}]: ${error.message}`,
          `${fieldName}[${index}]`,
          item
        );
      }
    });
  }

  return arr;
}

/**
 * User registration validation schema
 */
function validateUserRegistration(data) {
  const errors = [];
  const validated = {};

  try {
    validated.name = sanitizeString(data.name, { trim: true, maxLength: 100 });
    if (!validated.name) errors.push('Name is required');
    if (validated.name && validated.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validated.email = validateEmail(data.email, true);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validated.password = validatePassword(data.password, {
      minLength: 8,
      requireUppercase: false, // Making it less strict for user experience
      requireLowercase: true,
      requireNumbers: false,
    });
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validated.university = sanitizeString(data.university, { trim: true, maxLength: 200 });
    if (!validated.university) errors.push('University is required');
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validated.year = validateEnum(
      data.year,
      ['freshman', 'sophomore', 'junior', 'senior', 'graduate'],
      'Academic year'
    );
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validated.major = sanitizeString(data.major, { trim: true, maxLength: 100 });
    if (!validated.major) errors.push('Major is required');
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    const error = new ValidationError('Validation failed');
    error.errors = errors;
    throw error;
  }

  return validated;
}

/**
 * User login validation schema
 */
function validateUserLogin(data) {
  const errors = [];
  const validated = {};

  try {
    validated.email = validateEmail(data.email, true);
  } catch (error) {
    errors.push(error.message);
  }

  if (!data.password) {
    errors.push('Password is required');
  } else {
    validated.password = data.password;
  }

  if (errors.length > 0) {
    const error = new ValidationError('Validation failed');
    error.errors = errors;
    throw error;
  }

  return validated;
}

/**
 * Create validation middleware
 */
function createValidationMiddleware(validatorFn) {
  return (req, res, next) => {
    try {
      req.validatedData = validatorFn(req.body);
      next();
    } catch (error) {
      logger.warn('Validation failed', {
        url: req.originalUrl,
        method: req.method,
        errors: error.errors || [error.message],
        input: req.body,
      });

      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors || [error.message],
        });
      }

      return res.status(500).json({
        message: 'Validation error occurred',
      });
    }
  };
}

module.exports = {
  ValidationError,
  sanitizeString,
  validateEmail,
  validatePassword,
  validateObjectId,
  validateEnum,
  validateArray,
  validateUserRegistration,
  validateUserLogin,
  createValidationMiddleware,
  PATTERNS,
};
