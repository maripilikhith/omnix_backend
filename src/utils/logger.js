import winston from 'winston';
import config from '../config/index.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for development — human-readable.
 */
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp: ts, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}]: ${stack || message}${metaStr}`;
  }),
);

/**
 * Structured JSON format for production — parseable by log aggregators
 * (Datadog, ELK, Logtail, etc.)
 */
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json(),
);

/**
 * Application logger.
 *
 * Usage:
 *   logger.info('Server started', { port: 5001 });
 *   logger.error('DB connection failed', { error: err.message });
 *   logger.warn('Slow query', { duration: '2.3s', collection: 'courses' });
 */
export const logger = winston.createLogger({
  level: config.app.logLevel,
  format: config.app.isDev ? devFormat : prodFormat,
  defaultMeta: { service: config.app.name },
  transports: [
    new winston.transports.Console(),
    // In production, add file transports or external sinks here:
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  // Don't crash on uncaught logger errors
  exitOnError: false,
});
