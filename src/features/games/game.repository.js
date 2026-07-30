import { BaseRepository } from '../../shared/base.repository.js';
import { GameModel } from './game.model.js';

/**
 * Game data access layer.
 */
export class GameRepository extends BaseRepository {
  constructor() {
    super(GameModel);
  }

  /**
   * Find all published games for a course + module.
   */
  async findByCourseAndModule(courseSlug, moduleNumber, topicSlug = null) {
    const filter = { courseSlug, moduleNumber, isPublished: true };
    if (topicSlug) {
      filter.topicSlug = topicSlug;
    }
    return this.findAllUnpaginated(
      filter,
      { sort: { order: 1, createdAt: 1 }, select: '-htmlContent' },
    );
  }

  /**
   * Find all published games for a course (all modules).
   */
  async findByCourse(courseSlug) {
    return this.findAllUnpaginated(
      { courseSlug, isPublished: true },
      { sort: { moduleNumber: 1, order: 1, createdAt: 1 }, select: '-htmlContent' },
    );
  }

  /**
   * Find a game by its gameId (returns full document including htmlContent).
   */
  async findByGameId(gameId) {
    return this.findOne({ gameId });
  }

  /**
   * Find a game by its gameId but exclude htmlContent (for metadata-only responses).
   */
  async findByGameIdMeta(gameId) {
    return this.findOne({ gameId }, { select: '-htmlContent' });
  }

  /**
   * Find all games (admin — includes unpublished), without htmlContent.
   */
  async findAllAdmin(queryParams = {}) {
    return this.findAll({}, queryParams, {
      defaultSort: 'order createdAt',
      select: '-htmlContent',
    });
  }

  /**
   * Find all games unpaginated (admin legacy compat).
   */
  async findAllAdminUnpaginated() {
    return this.findAllUnpaginated(
      {},
      { sort: { order: 1, createdAt: -1 }, select: '-htmlContent' },
    );
  }

  /**
   * Find all published games across all courses unpaginated.
   */
  async findAllPublishedUnpaginated() {
    return this.findAllUnpaginated(
      { isPublished: true },
      { sort: { courseSlug: 1, moduleNumber: 1, order: 1, createdAt: 1 }, select: '-htmlContent' },
    );
  }

  /**
   * Check if a game with this gameId already exists.
   */
  async existsByGameId(gameId) {
    return this.exists({ gameId });
  }

  /**
   * Delete a game by its gameId.
   */
  async deleteByGameId(gameId) {
    const doc = await this.model.findOneAndDelete({ gameId });
    return doc;
  }
}

// Singleton instance
export const gameRepository = new GameRepository();
