import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '../config/rateLimit.config.js';

/**
 * Create a rate limiter with the specified preset.
 *
 * Available presets: 'global', 'auth', 'ai'
 *
 * Usage:
 *   app.use(createRateLimiter('global'));
 *   router.use(createRateLimiter('auth'));
 *
 * @param {'global'|'auth'|'ai'} preset - Rate limit preset name
 * @returns {Function} Express rate limiter middleware
 */
export const createRateLimiter = (preset = 'global') => {
  const config = rateLimitConfig[preset] || rateLimitConfig.global;
  return rateLimit(config);
};
