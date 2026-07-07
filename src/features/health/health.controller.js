import mongoose from 'mongoose';
import config from '../../config/index.js';

export const healthController = {
  /**
   * GET /health — Detailed health status.
   */
  check(_req, res) {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    res.json({
      status: 'ok',
      service: config.app.name,
      version: config.app.version,
      environment: config.app.env,
      time: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: dbStatus[dbState] || 'unknown',
    });
  },

  /**
   * GET /ping — Lightweight keep-alive (Render free-tier, etc.)
   */
  ping(_req, res) {
    res.json({ ok: true, ts: Date.now() });
  },
};
