import { BaseRepository } from '../../shared/base.repository.js';
import { CourseModel } from './course.model.js';

/**
 * Course data access layer.
 */
export class CourseRepository extends BaseRepository {
  constructor() {
    super(CourseModel);
  }

  /**
   * Find all published courses.
   */
  async findPublished(queryParams = {}) {
    return this.findAll({ isPublished: true }, queryParams, {
      defaultSort: '-createdAt',
    });
  }

  /**
   * Find all published courses WITHOUT pagination (legacy compat).
   */
  async findAllPublishedUnpaginated() {
    return this.findAllUnpaginated({ isPublished: true }, { sort: { createdAt: -1 } });
  }

  /**
   * Find a published course by slug.
   */
  async findBySlug(slug) {
    return this.findOne({ courseSlug: slug, isPublished: true });
  }

  /**
   * Find a course by slug (any status — for admin).
   */
  async findBySlugAdmin(slug) {
    return this.findOne({ courseSlug: slug });
  }

  /**
   * Find featured courses.
   */
  async findFeatured() {
    return this.findAllUnpaginated(
      { isPublished: true, isFeatured: true },
      { sort: { createdAt: -1 } },
    );
  }

  /**
   * Find courses by genre.
   */
  async findByGenre(genre, queryParams = {}) {
    return this.findAll({ genre, isPublished: true }, queryParams);
  }
}

// Singleton instance
export const courseRepository = new CourseRepository();
