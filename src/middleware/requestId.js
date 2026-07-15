/**
 * Request ID middleware.
 * Generates a unique ID for every incoming request using the native
 * crypto.randomUUID() (Node 18+, no extra dependency needed).
 *
 * - Reads `X-Request-ID` from the client if provided (useful for tracing
 *   across services), otherwise generates a fresh UUID.
 * - Attaches the ID to `req.requestId` for use in logs / error responses.
 * - Sets `X-Request-ID` on the response so clients can correlate replies.
 *
 * Must be the FIRST middleware registered so every subsequent log line
 * can include the ID.
 */
import { randomUUID } from 'crypto';

export const requestId = (req, res, next) => {
  // Honour upstream-provided IDs (e.g. from an API gateway or load balancer).
  const id = (req.headers['x-request-id'] || randomUUID()).slice(0, 36);
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
};
