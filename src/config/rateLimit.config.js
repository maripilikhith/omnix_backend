/**
 * Rate limiting configuration.
 */
export const rateLimitConfig = Object.freeze({
  global: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
        statusCode: 429,
      },
    },
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 20, // Stricter for auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
  },
  ai: {
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // AI endpoints are expensive
    standardHeaders: true,
    legacyHeaders: false,
  },
});
