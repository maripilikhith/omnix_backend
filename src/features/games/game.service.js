import { BaseService } from '../../shared/base.service.js';
import { gameRepository } from './game.repository.js';
import { NotFoundError, ConflictError } from '../../utils/ApiError.js';
import { ERROR_CODES } from '../../constants/index.js';

/**
 * Game business logic layer.
 */
export class GameService extends BaseService {
  constructor() {
    super(gameRepository);
  }

  /**
   * Get all published games for a specific course + module.
   * Used by the frontend to dynamically discover available games.
   */
  async getGamesForModule(courseSlug, moduleNumber, topicSlug = null) {
    return this.repository.findByCourseAndModule(courseSlug, moduleNumber, topicSlug);
  }

  /**
   * Get all published games for a course (across all modules).
   */
  async getGamesForCourse(courseSlug) {
    return this.repository.findByCourse(courseSlug);
  }

  /**
   * Get all published games across all courses.
   */
  async getAllPublishedGames() {
    return this.repository.findAllPublishedUnpaginated();
  }

  /**
   * Get a game's metadata only (no htmlContent).
   */
  async getGameMeta(gameId) {
    const game = await this.repository.findByGameIdMeta(gameId);
    if (!game) {
      throw new NotFoundError('Game', ERROR_CODES.GAME_NOT_FOUND);
    }
    return game;
  }

  /**
   * Get the full HTML content for a game (for iframe rendering).
   */
  async getGameHtml(gameId) {
    const game = await this.repository.findByGameId(gameId);
    if (!game) {
      throw new NotFoundError('Game', ERROR_CODES.GAME_NOT_FOUND);
    }
    return game.htmlContent;
  }

  /**
   * Create a new game with metadata + htmlContent.
   */
  async createGame(data) {
    // Check for duplicate gameId
    const exists = await this.repository.existsByGameId(data.gameId);
    if (exists) {
      throw new ConflictError(
        `Game with gameId "${data.gameId}" already exists`,
        ERROR_CODES.GAME_ALREADY_EXISTS,
      );
    }
    return this.repository.create(data);
  }

  /**
   * Update a game by its MongoDB _id.
   */
  async updateGame(id, data) {
    if (data.htmlContent !== undefined && (!data.htmlContent || !data.htmlContent.trim())) {
      delete data.htmlContent;
    }
    return this.repository.updateById(id, data);
  }

  /**
   * Delete a game by its MongoDB _id.
   */
  async deleteGame(id) {
    return this.repository.deleteById(id);
  }

  /**
   * Delete a game by its gameId.
   */
  async deleteGameByGameId(gameId) {
    const doc = await this.repository.deleteByGameId(gameId);
    if (!doc) {
      throw new NotFoundError('Game', ERROR_CODES.GAME_NOT_FOUND);
    }
    return doc;
  }

  /**
   * Get all games (admin — includes unpublished).
   */
  async getAllGamesAdmin(queryParams) {
    return this.repository.findAllAdmin(queryParams);
  }

  /**
   * Get all games unpaginated (admin legacy compat).
   */
  async getAllGamesAdminUnpaginated() {
    return this.repository.findAllAdminUnpaginated();
  }

  /**
   * Toggle publish status.
   */
  async togglePublish(id) {
    const game = await this.repository.findById(id, { select: '-htmlContent' });
    game.isPublished = !game.isPublished;
    await game.save();
    return game;
  }
}

// Singleton instance
export const gameService = new GameService();
