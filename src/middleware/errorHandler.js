import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../constants/index.js';
import config from '../config/index.js';

/**
 * Global error handler middleware.
 * Catches all errors passed via next(err) and returns a consistent JSON response.
 *
 * Must be registered LAST in the middleware chain.
 */
export const errorHandler = (err, _req, res, _next) => {
  // Default to 500 if no status code is set
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';
  let errors = err.errors || [];

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors && !err.statusCode) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    code = 'VALIDATION_ERROR';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    code = 'RESOURCE_CONFLICT';
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Duplicate value for field: ${field}` : 'Duplicate key error';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    code = 'AUTH_TOKEN_INVALID';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    code = 'AUTH_TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error('Unhandled server error', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  } else {
    logger.warn('Client error', { message, statusCode, code });
  }

  // Build response
  const response = {
    success: false,
    error: {
      code,
      message,
      statusCode,
      ...(errors.length > 0 && { errors }),
      // Include request ID so users can report it to support
      requestId: _req.requestId,
      // Include stack trace only in development
      ...(config.app.isDev && err.stack && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};
