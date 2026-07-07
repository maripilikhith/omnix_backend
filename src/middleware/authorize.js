import { AuthorizationError } from '../utils/ApiError.js';

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticate middleware.
 *
 * Usage:
 *   router.delete('/courses/:id', authenticate, authorize('admin'), controller.delete);
 *   router.put('/courses/:id', authenticate, authorize('admin', 'instructor'), controller.update);
 *
 * @param {...string} allowedRoles - Roles that are permitted
 * @returns {Function} Express middleware
 */
export const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required before authorization');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Role '${req.user.role}' is not authorized to access this resource`,
      );
    }

    next();
  };
};
