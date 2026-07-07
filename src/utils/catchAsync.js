/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to the Express error handler.
 *
 * Eliminates repetitive try/catch blocks in every controller method.
 *
 * Usage:
 *   router.get('/courses', catchAsync(controller.list));
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Wrapped handler
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
