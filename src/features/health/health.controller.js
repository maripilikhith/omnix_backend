import mongoose from 'mongoose';
import config from '../../config/index.js';

const DB_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
  };
}

export const healthController = {
  /**
   * GET /health — Full health status (used by dashboards / monitoring).
   */
  check(_req, res) {
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1;

    res.status(isDbConnected ? 200 : 503).json({
      status: isDbConnected ? 'ok' : 'degraded',
      service: config.app.name,
      version: config.app.version,
      environment: config.app.env,
      time: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: DB_STATES[dbState] || 'unknown',
      memory: getMemoryUsage(),
    });
  },

  /**
   * GET /health/live — Liveness probe.
   * Returns 200 as long as the process is running (even if DB is down).
   * Container orchestrators restart the pod only if this returns non-2xx.
   */
  live(_req, res) {
    res.json({ status: 'alive', uptime: `${Math.floor(process.uptime())}s` });
  },

  /**
   * GET /health/ready — Readiness probe.
   * Returns 200 only when the DB connection is established.
   * Load balancers stop routing traffic here if this returns non-2xx.
   */
  ready(_req, res) {
    const isReady = mongoose.connection.readyState === 1;
    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'ready' : 'not_ready',
      database: DB_STATES[mongoose.connection.readyState] || 'unknown',
    });
  },

  /**
   * GET /ping — Lightweight keep-alive (Render free-tier, etc.)
   */
  ping(_req, res) {
    res.json({ ok: true, ts: Date.now() });
  },
};
