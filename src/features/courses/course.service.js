import { BaseService } from '../../shared/base.service.js';
import { courseRepository } from './course.repository.js';
import { NotFoundError } from '../../utils/ApiError.js';
import { ERROR_CODES } from '../../constants/index.js';

/**
 * Course business logic layer.
 */
export class CourseService extends BaseService {
  constructor() {
    super(courseRepository);
  }

  /**
   * Get all published courses (public-facing).
   */
  async getPublishedCourses(queryParams) {
    return this.repository.findPublished(queryParams);
  }

  /**
   * Get all published courses unpaginated (legacy compat).
   */
  async getAllPublishedUnpaginated() {
    return this.repository.findAllPublishedUnpaginated();
  }

  /**
   * Get a published course by slug with all related content.
   * Related data (modules, topics, stories, explainers) is fetched in parallel.
   */
  async getCourseBySlug(slug) {
    const course = await this.repository.findBySlug(slug);
    if (!course) {
      throw new NotFoundError('Course', ERROR_CODES.COURSE_NOT_FOUND);
    }
    return course;
  }

  /**
   * Get all courses (admin — includes unpublished).
   */
  async getAllCoursesAdmin(queryParams) {
    return this.repository.findAll({}, queryParams, { defaultSort: '-createdAt' });
  }

  /**
   * Get all courses unpaginated (admin legacy compat).
   */
  async getAllCoursesAdminUnpaginated() {
    return this.repository.findAllUnpaginated({}, { sort: { createdAt: -1 } });
  }

  /**
   * Create a new course.
   */
  async createCourse(data) {
    return this.repository.create(data);
  }

  /**
   * Update a course by ID.
   */
  async updateCourse(id, data) {
    return this.repository.updateById(id, data);
  }

  /**
   * Delete a course by ID.
   */
  async deleteCourse(id) {
    return this.repository.deleteById(id);
  }

  /**
   * Get featured courses.
   */
  async getFeaturedCourses() {
    return this.repository.findFeatured();
  }
}

// Singleton instance
export const courseService = new CourseService();
