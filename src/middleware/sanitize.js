import mongoSanitize from 'express-mongo-sanitize';

/**
 * Input sanitization middleware.
 * Removes MongoDB operators ($gt, $ne, etc.) from user input to prevent NoSQL injection.
 *
 * Usage:
 *   app.use(sanitize());
 */
export const sanitize = () => {
  return (req, res, next) => {
    ['body', 'params', 'query'].forEach((key) => {
      if (req[key]) {
        mongoSanitize.sanitize(req[key], { replaceWith: '_' });
      }
    });
    next();
  };
};
