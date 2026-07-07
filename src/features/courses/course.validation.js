import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';
import { GENRES, DIFFICULTIES, CONTENT_TYPES } from '../../constants/index.js';

/**
 * Validation schemas for course endpoints.
 */

export const createCourseSchema = {
  body: Joi.object({
    courseSlug: commonValidators.slug.required(),
    title: commonValidators.requiredString,
    description: commonValidators.optionalString,
    longDescription: commonValidators.optionalString,
    genre: Joi.string().valid(...GENRES).required(),
    difficulty: Joi.string().valid(...DIFFICULTIES).required(),
    tags: Joi.array().items(Joi.string().trim()).default([]),
    thumbnailUrl: Joi.string().uri().required(),
    thumbnailUrlLight: Joi.string().uri().allow('').default(''),
    trailerUrl: Joi.string().uri().allow('').default(''),
    instructorId: commonValidators.objectId,
    instructorName: commonValidators.optionalString,
    totalModules: commonValidators.positiveInt,
    totalTopics: commonValidators.positiveInt,
    totalDurationSeconds: commonValidators.positiveInt,
    isPublished: Joi.boolean().default(false),
    isFeatured: Joi.boolean().default(false),
    contentType: Joi.string().valid(...CONTENT_TYPES).default('Course'),
    xpReward: commonValidators.positiveInt,
  }),
};

export const updateCourseSchema = {
  params: commonValidators.idParam,
  body: Joi.object({
    courseSlug: commonValidators.slug,
    title: Joi.string().trim().min(1),
    description: commonValidators.optionalString,
    longDescription: commonValidators.optionalString,
    genre: Joi.string().valid(...GENRES),
    difficulty: Joi.string().valid(...DIFFICULTIES),
    tags: Joi.array().items(Joi.string().trim()),
    thumbnailUrl: Joi.string().uri(),
    thumbnailUrlLight: Joi.string().uri().allow(''),
    trailerUrl: Joi.string().uri().allow(''),
    instructorId: commonValidators.objectId,
    instructorName: commonValidators.optionalString,
    totalModules: commonValidators.positiveInt,
    totalTopics: commonValidators.positiveInt,
    totalDurationSeconds: commonValidators.positiveInt,
    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean(),
    contentType: Joi.string().valid(...CONTENT_TYPES),
    publishedAt: Joi.date().allow(null),
    xpReward: commonValidators.positiveInt,
  }).min(1), // At least one field required
};

export const getCourseBySlugSchema = {
  params: commonValidators.courseSlugParam,
};

export const getCourseByIdSchema = {
  params: commonValidators.idParam,
};

export const deleteCourseSchema = {
  params: commonValidators.idParam,
};

export const listCoursesSchema = {
  query: commonValidators.paginationQuery.keys({
    genre: Joi.string().valid(...GENRES),
    difficulty: Joi.string().valid(...DIFFICULTIES),
    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean(),
  }),
};
