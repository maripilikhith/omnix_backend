import { Router } from 'express';
import { gameController } from './game.controller.js';
import { validate } from '../../middleware/validate.js';
import { catchAsync } from '../../utils/catchAsync.js';
import {
  listGamesSchema,
  getGameByIdSchema,
} from './game.validation.js';

const router = Router();

// ─── Public Routes (/api/v1/games) ────────────────────────────────────────────

/**
 * GET /api/v1/games
 * Query params: ?courseSlug=xxx&module=1
 * Returns published games (metadata only, no htmlContent).
 */
router.get(
  '/',
  validate(listGamesSchema),
  catchAsync(gameController.listPublished),
);

/**
 * POST /api/v1/games/tts
 * Proxy endpoint for Azure Speech TTS audio.
 */
router.post(
  '/tts',
  catchAsync(gameController.speakTts),
);

/**
 * GET /api/v1/games/speech-token
 * Token endpoint for short-lived Azure Speech SDK streaming token.
 */
router.get(
  '/speech-token',
  catchAsync(gameController.getSpeechToken),
);

/**
 * GET /api/v1/games/:gameId
 * Returns game metadata (no htmlContent).
 */
router.get(
  '/:gameId',
  validate(getGameByIdSchema),
  catchAsync(gameController.getByGameId),
);

/**
 * GET /api/v1/games/:gameId/play
 * Returns raw HTML for iframe embedding (Content-Type: text/html).
 */
router.get(
  '/:gameId/play',
  validate(getGameByIdSchema),
  catchAsync(gameController.play),
);

export { router as gameRoutes };
