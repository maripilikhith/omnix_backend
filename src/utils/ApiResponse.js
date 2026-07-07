import { HTTP_STATUS } from '../constants/index.js';

/**
 * Standardized API response builder.
 * Ensures every response from the API has a consistent shape.
 */
export class ApiResponse {
  /**
   * Success response.
   * @param {import('express').Response} res
   * @param {*} data - Response payload
   * @param {number} [statusCode=200]
   * @param {object} [meta] - Pagination or extra metadata
   */
  static success(res, data, statusCode = HTTP_STATUS.OK, meta = null) {
    const response = { success: true, data };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201).
   */
  static created(res, data) {
    return ApiResponse.success(res, data, HTTP_STATUS.CREATED);
  }

  /**
   * No content response (204).
   */
  static noContent(res) {
    return res.status(HTTP_STATUS.NO_CONTENT).end();
  }

  /**
   * Error response.
   * Typically called by the global error handler, not controllers directly.
   */
  static error(res, statusCode, message, code = 'ERROR', errors = []) {
    const response = {
      success: false,
      error: {
        code,
        message,
        statusCode,
        ...(errors.length > 0 && { errors }),
      },
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Raw JSON response — for legacy compatibility endpoints that
   * need to match the exact shape of the old API.
   */
  static raw(res, data, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json(data);
  }
}
