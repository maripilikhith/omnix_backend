import winston from 'winston';
import { mkdirSync } from 'fs';
import config from '../config/index.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for development — human-readable.
 */
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp: ts, level, message, stack, requestId, ...meta }) => {
    const rid = requestId ? ` [${requestId.slice(0, 8)}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts}${rid} [${level}]: ${stack || message}${metaStr}`;
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

// Ensure logs directory exists in production
const transports = [new winston.transports.Console()];

if (!config.app.isDev) {
  try {
    mkdirSync('logs', { recursive: true });
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 10 * 1024 * 1024, // 10 MB
        maxFiles: 5,
        tailable: true,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 20 * 1024 * 1024, // 20 MB
        maxFiles: 10,
        tailable: true,
      }),
    );
  } catch {
    // If we can't create the log directory, console-only is fine
  }
}

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
  transports,
  // Don't crash on uncaught logger errors
  exitOnError: false,
});
