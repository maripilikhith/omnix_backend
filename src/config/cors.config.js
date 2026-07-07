/**
 * CORS configuration.
 * Allows Vercel deployments, localhost, and configured origins.
 */
export const corsConfig = Object.freeze({
  /**
   * Dynamic origin handler — mirrors the logic from server v1.
   * Accepts Vercel subdomains, localhost, and any explicitly configured origins.
   */
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, health checks)
    if (!origin) return callback(null, true);

    const allowedPatterns = [
      'vercel.app',
      'localhost',
      '127.0.0.1',
    ];

    // Add any explicitly configured origins
    const extraOrigins = (process.env.CORS_ORIGIN || '').split(',').filter(Boolean);

    const isAllowed =
      allowedPatterns.some((pattern) => origin.includes(pattern)) ||
      extraOrigins.includes(origin);

    if (isAllowed) return callback(null, true);

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours preflight cache
});
