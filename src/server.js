import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';
import { logger } from './utils/logger.js';

/**
 * Server entry point.
 * Connects to MongoDB, starts the HTTP server, and handles graceful shutdown.
 */

const startServer = async () => {
  try {
    // ─── Database Connection ────────────────────────────────────────────────────
    logger.info('Connecting to MongoDB...', {
      uri: config.db.uri.replace(/\/\/.*@/, '//***:***@'), // Mask credentials in logs
    });

    await mongoose.connect(config.db.uri, config.db.options);
    logger.info('Connected to MongoDB successfully', {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });

    // ─── Start HTTP Server ──────────────────────────────────────────────────────
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 ${config.app.name} v${config.app.version} running`, {
        port: config.app.port,
        env: config.app.env,
        pid: process.pid,
      });
      logger.info('API endpoints:', {
        v1: `http://localhost:${config.app.port}/api/v1`,
        legacy_public: `http://localhost:${config.app.port}/api/public`,
        legacy_admin: `http://localhost:${config.app.port}/api/admin`,
        health: `http://localhost:${config.app.port}/health`,
      });
    });

    // ─── Graceful Shutdown ──────────────────────────────────────────────────────
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database connection
        try {
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
        } catch (err) {
          logger.error('Error closing MongoDB connection', { error: err.message });
        }

        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown — could not close connections in time');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ─── Unhandled Errors ───────────────────────────────────────────────────────
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection', { reason: reason?.message || reason });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
