import { gameService } from './game.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { HTTP_STATUS } from '../../constants/index.js';

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Resolve published games from query params.
 * Shared by both v1 and legacy list endpoints.
 */
async function resolvePublishedGames({ courseSlug, module: moduleNumber, topicSlug }) {
  if (courseSlug && moduleNumber) {
    return gameService.getGamesForModule(courseSlug, Number(moduleNumber), topicSlug);
  }
  if (courseSlug) {
    return gameService.getGamesForCourse(courseSlug);
  }
  return gameService.getAllPublishedGames();
}

/**
 * Strip security headers that block iframe embedding and
 * send raw HTML with permissive CORS.
 */
function sendGameHtml(res, html) {
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Strict-Transport-Security');
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.type('html').send(html);
}

/**
 * Strip htmlContent from a Mongoose document for lean responses.
 */
function stripHtmlContent(game) {
  const { htmlContent, ...meta } = game.toObject();
  return meta;
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * Game controller — thin layer that extracts request data,
 * delegates to the service, and formats the response.
 */
export const gameController = {
  // ─── Public Endpoints ───────────────────────────────────────────

  /**
   * GET /api/v1/games?courseSlug=xxx&module=1 — List published games.
   * If both courseSlug + module are provided, returns games for that module.
   * If only courseSlug is provided, returns all games for that course.
   */
  async listPublished(req, res) {
    const games = await resolvePublishedGames(req.query);
    return ApiResponse.success(res, games);
  },

  /**
   * GET /api/v1/games/:gameId — Get game metadata (no htmlContent).
   */
  async getByGameId(req, res) {
    const game = await gameService.getGameMeta(req.params.gameId);
    return ApiResponse.success(res, game);
  },

  /**
   * GET /api/v1/games/:gameId/play — Serve the raw HTML for iframe embedding.
   * Returns Content-Type: text/html (not JSON).
   */
  async play(req, res) {
    const html = await gameService.getGameHtml(req.params.gameId);
    sendGameHtml(res, html);
  },

  // ─── Admin Endpoints ────────────────────────────────────────────

  /**
   * GET /api/v1/admin/games — List ALL games (admin).
   */
  async listAll(req, res) {
    const { data, meta } = await gameService.getAllGamesAdmin(req.query);
    return ApiResponse.success(res, data, HTTP_STATUS.OK, meta);
  },

  /**
   * POST /api/v1/admin/games — Create a game.
   */
  async create(req, res) {
    const game = await gameService.createGame(req.body);
    return ApiResponse.created(res, stripHtmlContent(game));
  },

  /**
   * PUT /api/v1/admin/games/:id — Update a game.
   */
  async update(req, res) {
    const game = await gameService.updateGame(req.params.id, req.body);
    return ApiResponse.success(res, game);
  },

  /**
   * DELETE /api/v1/admin/games/:id — Delete a game by MongoDB _id.
   */
  async remove(req, res) {
    await gameService.deleteGame(req.params.id);
    return ApiResponse.success(res, { message: 'Game deleted successfully' });
  },

  /**
   * PATCH /api/v1/admin/games/:id/publish — Toggle publish status.
   */
  async togglePublish(req, res) {
    const game = await gameService.togglePublish(req.params.id);
    return ApiResponse.success(res, game);
  },

  // ─── Legacy Compatibility Endpoints ─────────────────────────────

  /**
   * Legacy: GET /api/public/games?courseSlug=xxx&module=1
   * Returns raw array (no { success, data } wrapper).
   */
  async legacyListPublished(req, res) {
    const games = await resolvePublishedGames(req.query);
    return ApiResponse.raw(res, games);
  },

  /**
   * Legacy: GET /api/public/games/:gameId/play
   * Serves raw HTML for iframe.
   */
  async legacyPlay(req, res) {
    const html = await gameService.getGameHtml(req.params.gameId);
    sendGameHtml(res, html);
  },

  /**
   * Legacy: GET /api/admin/games
   */
  async legacyListAll(_req, res) {
    const games = await gameService.getAllGamesAdminUnpaginated();
    return ApiResponse.raw(res, games);
  },

  /**
   * Legacy: POST /api/admin/games
   */
  async legacyCreate(req, res) {
    const game = await gameService.createGame(req.body);
    return ApiResponse.raw(res, stripHtmlContent(game), HTTP_STATUS.CREATED);
  },

  /**
   * Legacy: PUT /api/admin/games/:id
   */
  async legacyUpdate(req, res) {
    const game = await gameService.updateGame(req.params.id, req.body);
    return ApiResponse.raw(res, game);
  },

  /**
   * Legacy: DELETE /api/admin/games/:id
   */
  async legacyRemove(req, res) {
    await gameService.deleteGame(req.params.id);
    return ApiResponse.raw(res, { message: 'Game deleted successfully' });
  },
};
