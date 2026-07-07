import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../utils/ApiError.js';
import { ERROR_CODES } from '../constants/index.js';
import config from '../config/index.js';

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header, verifies it,
 * and attaches the decoded user payload to req.user.
 *
 * Usage:
 *   router.get('/profile', authenticate, controller.getProfile);
 */
export const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Access token is required', ERROR_CODES.AUTH_TOKEN_MISSING);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired', ERROR_CODES.AUTH_TOKEN_EXPIRED);
    }
    throw new AuthenticationError('Invalid token', ERROR_CODES.AUTH_TOKEN_INVALID);
  }
};
