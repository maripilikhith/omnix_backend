/**
 * Rate limiting configuration.
 *
 * To use Redis as the store (required for multi-instance deployments):
 *   npm install rate-limit-redis ioredis
 *   import RedisStore from 'rate-limit-redis';
 *   import Redis from 'ioredis';
 *   const redis = new Redis(process.env.REDIS_URL);
 *   Then add `store: new RedisStore({ sendCommand: (...args) => redis.call(...args) })`
 *   to each config object below.
 */

// Routes that should never be rate-limited (health probes, etc.)
const SKIP_PATHS = new Set(['/health', '/health/live', '/health/ready', '/ping']);

const defaultSkip = (req) => SKIP_PATHS.has(req.path);

// Use the real client IP even behind a reverse proxy / load balancer
const defaultKeyGenerator = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

export const rateLimitConfig = Object.freeze({
  global: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: defaultSkip,
    keyGenerator: defaultKeyGenerator,
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
    keyGenerator: defaultKeyGenerator,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts, please try again later.',
        statusCode: 429,
      },
    },
  },
  ai: {
    windowMs: 60 * 1000, // 1-minute window
    max: 10, // AI endpoints are expensive
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: defaultKeyGenerator,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'AI rate limit reached, please wait a moment.',
        statusCode: 429,
      },
    },
  },
});
