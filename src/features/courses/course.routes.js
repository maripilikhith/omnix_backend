import { Router } from 'express';
import { courseController } from './course.controller.js';
import { validate } from '../../middleware/validate.js';
import { catchAsync } from '../../utils/catchAsync.js';
import {
  createCourseSchema,
  updateCourseSchema,
  getCourseBySlugSchema,
  deleteCourseSchema,
  listCoursesSchema,
} from './course.validation.js';

const router = Router();

// ─── Public Routes (/api/v1/courses) ──────────────────────────────────────────

router.get(
  '/',
  validate(listCoursesSchema),
  catchAsync(courseController.listPublished),
);

router.get(
  '/:courseSlug',
  validate(getCourseBySlugSchema),
  catchAsync(courseController.getBySlug),
);

export { router as courseRoutes };
