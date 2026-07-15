import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../utils/ApiError.js';
import { ERROR_CODES } from '../constants/index.js';
import config from '../config/index.js';
import { UserModel } from '../features/auth/user.model.js';

/**
 * JWT authentication middleware.
 * Verifies the token for identity, then fetches the live user record from DB
 * so that role changes take effect immediately (no re-login required).
 *
 * Usage:
 *   router.get('/profile', authenticate, controller.getProfile);
 */
export const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Access token is required', ERROR_CODES.AUTH_TOKEN_MISSING));
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.auth.jwtSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token has expired', ERROR_CODES.AUTH_TOKEN_EXPIRED));
    }
    return next(new AuthenticationError('Invalid token', ERROR_CODES.AUTH_TOKEN_INVALID));
  }

  // Fetch fresh user from DB so role changes (e.g. student → admin) are instant
  try {
    const user = await UserModel.findById(decoded.id).lean();
    if (!user) {
      return next(new AuthenticationError('User not found', ERROR_CODES.AUTH_TOKEN_INVALID));
    }
    // Attach live user data (override JWT-baked role with current DB role)
    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch {
    return next(new AuthenticationError('Authentication failed', ERROR_CODES.AUTH_TOKEN_INVALID));
  }
};
