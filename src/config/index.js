import 'dotenv/config'; // Load .env before anything else is evaluated

import { appConfig } from './app.config.js';
import { dbConfig } from './db.config.js';
import { authConfig } from './auth.config.js';
import { corsConfig } from './cors.config.js';
import { rateLimitConfig } from './rateLimit.config.js';
import { aiConfig } from './ai.config.js';

/**
 * Unified configuration object.
 * All settings are resolved from environment variables with sensible defaults.
 * Import this single object anywhere you need configuration.
 */
const config = Object.freeze({
  app: appConfig,
  db: dbConfig,
  auth: authConfig,
  cors: corsConfig,
  rateLimit: rateLimitConfig,
  ai: aiConfig,
});

export default config;
export { appConfig, dbConfig, authConfig, corsConfig, rateLimitConfig, aiConfig };
