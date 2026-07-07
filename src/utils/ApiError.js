import { HTTP_STATUS, ERROR_CODES } from '../constants/index.js';

/**
 * Base application error class.
 * Provides structured error information for the global error handler.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable error message
   * @param {string} [code] - Machine-readable error code
   * @param {boolean} [isOperational=true] - Whether this is an expected operational error
   * @param {Array} [errors=[]] - Detailed validation errors
   */
  constructor(
    statusCode,
    message,
    code = ERROR_CODES.INTERNAL_ERROR,
    isOperational = true,
    errors = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.errors = errors;

    // Capture clean stack trace (excludes constructor call)
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serialize for API response.
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        ...(this.errors.length > 0 && { errors: this.errors }),
      },
    };
  }
}

/**
 * 400 — Bad Request / Validation Error
 */
export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors = []) {
    super(HTTP_STATUS.BAD_REQUEST, message, ERROR_CODES.VALIDATION_ERROR, true, errors);
  }
}

/**
 * 401 — Unauthorized
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required', code = ERROR_CODES.AUTH_TOKEN_MISSING) {
    super(HTTP_STATUS.UNAUTHORIZED, message, code);
  }
}

/**
 * 403 — Forbidden
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(HTTP_STATUS.FORBIDDEN, message, ERROR_CODES.AUTH_FORBIDDEN);
  }
}

/**
 * 404 — Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource = 'Resource', code = ERROR_CODES.RESOURCE_NOT_FOUND) {
    super(HTTP_STATUS.NOT_FOUND, `${resource} not found`, code);
  }
}

/**
 * 409 — Conflict
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists', code = ERROR_CODES.RESOURCE_CONFLICT) {
    super(HTTP_STATUS.CONFLICT, message, code);
  }
}
