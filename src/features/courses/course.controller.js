import { courseService } from './course.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { HTTP_STATUS } from '../../constants/index.js';

/**
 * Course controller — thin layer that extracts request data,
 * delegates to the service, and formats the response.
 */
export const courseController = {
  // ─── Public Endpoints ───────────────────────────────────────────

  /**
   * GET /api/v1/courses — List published courses with pagination.
   */
  async listPublished(req, res) {
    const { data, meta } = await courseService.getPublishedCourses(req.query);
    return ApiResponse.success(res, data, HTTP_STATUS.OK, meta);
  },

  /**
   * GET /api/v1/courses/:courseSlug — Get a published course by slug.
   */
  async getBySlug(req, res) {
    const course = await courseService.getCourseBySlug(req.params.courseSlug);
    return ApiResponse.success(res, course);
  },

  // ─── Admin Endpoints ────────────────────────────────────────────

  /**
   * GET /api/v1/admin/courses — List ALL courses (admin).
   */
  async listAll(req, res) {
    const { data, meta } = await courseService.getAllCoursesAdmin(req.query);
    return ApiResponse.success(res, data, HTTP_STATUS.OK, meta);
  },

  /**
   * POST /api/v1/admin/courses — Create a course.
   */
  async create(req, res) {
    const course = await courseService.createCourse(req.body);
    return ApiResponse.created(res, course);
  },

  /**
   * PUT /api/v1/admin/courses/:id — Update a course.
   */
  async update(req, res) {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return ApiResponse.success(res, course);
  },

  /**
   * DELETE /api/v1/admin/courses/:id — Delete a course.
   */
  async remove(req, res) {
    await courseService.deleteCourse(req.params.id);
    return ApiResponse.success(res, { message: 'Course deleted successfully' });
  },

  // ─── Legacy Compatibility Endpoints ─────────────────────────────
  // These return raw arrays (no { success, data } wrapper) to match
  // the existing server's response shape expected by the frontend.

  /**
   * Legacy: GET /api/public/courses
   */
  async legacyListPublished(_req, res) {
    const courses = await courseService.getAllPublishedUnpaginated();
    // Add slug alias like the old API
    const withSlug = courses.map((c) => {
      const obj = c.toObject();
      obj.slug = obj.courseSlug;
      return obj;
    });
    return ApiResponse.raw(res, withSlug);
  },

  /**
   * Legacy: GET /api/admin/courses
   */
  async legacyListAll(_req, res) {
    const courses = await courseService.getAllCoursesAdminUnpaginated();
    return ApiResponse.raw(res, courses);
  },

  /**
   * Legacy: POST /api/admin/courses
   */
  async legacyCreate(req, res) {
    const course = await courseService.createCourse(req.body);
    return ApiResponse.raw(res, course, HTTP_STATUS.CREATED);
  },

  /**
   * Legacy: PUT /api/admin/courses/:id
   */
  async legacyUpdate(req, res) {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return ApiResponse.raw(res, course);
  },

  /**
   * Legacy: DELETE /api/admin/courses/:id
   */
  async legacyRemove(req, res) {
    await courseService.deleteCourse(req.params.id);
    return ApiResponse.raw(res, { message: 'Course deleted successfully' });
  },
};
