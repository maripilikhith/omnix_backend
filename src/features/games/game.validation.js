import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';
import { DIFFICULTIES } from '../../constants/index.js';

/**
 * Validation schemas for game endpoints.
 */

export const createGameSchema = {
  body: Joi.object({
    gameId: Joi.string().trim().required(),
    templateId: Joi.string().trim().required(),
    courseId: commonValidators.objectId,
    courseSlug: commonValidators.slug,
    moduleNumber: Joi.number().integer().min(1),
    topicId: commonValidators.objectId.optional().allow(null, ''),
    topicSlug: commonValidators.slug.optional().allow(null, ''),
    title: commonValidators.requiredString,
    description: commonValidators.optionalString,
    genre: commonValidators.optionalString,
    activityType: Joi.string().valid('game', 'simulation').default('game'),
    difficulty: Joi.string().valid(...DIFFICULTIES).default('Intermediate'),
    conceptsTested: Joi.array().items(Joi.string().trim()).default([]),
    xpReward: Joi.number().integer().min(0).default(300),
    estimatedMinutes: Joi.number().integer().min(1).default(5),
    htmlContent: Joi.string().required(),
    version: Joi.number().integer().min(1).default(1),
    order: Joi.number().integer().min(0).default(0),
    isPublished: Joi.boolean().default(true),
  }),
};

export const updateGameSchema = {
  params: commonValidators.idParam,
  body: Joi.object({
    templateId: Joi.string().trim(),
    courseId: commonValidators.objectId,
    courseSlug: commonValidators.slug,
    moduleNumber: Joi.number().integer().min(1),
    topicId: commonValidators.objectId.optional().allow(null, ''),
    topicSlug: commonValidators.slug.optional().allow(null, ''),
    title: Joi.string().trim().min(1),
    description: commonValidators.optionalString,
    genre: commonValidators.optionalString,
    activityType: Joi.string().valid('game', 'simulation'),
    difficulty: Joi.string().valid(...DIFFICULTIES),
    conceptsTested: Joi.array().items(Joi.string().trim()),
    xpReward: Joi.number().integer().min(0),
    estimatedMinutes: Joi.number().integer().min(1),
    htmlContent: Joi.string().allow('', null).optional(),
    version: Joi.number().integer().min(1),
    order: Joi.number().integer().min(0),
    isPublished: Joi.boolean(),
  }).min(1),
};

export const getGameByIdSchema = {
  params: Joi.object({
    gameId: Joi.string().trim().required(),
  }),
};

export const deleteGameSchema = {
  params: commonValidators.idParam,
};

export const togglePublishSchema = {
  params: commonValidators.idParam,
};

export const listGamesSchema = {
  query: commonValidators.paginationQuery.keys({
    courseSlug: Joi.string().trim().lowercase(),
    module: Joi.number().integer().min(1),
    difficulty: Joi.string().valid(...DIFFICULTIES),
    isPublished: Joi.boolean(),
  }),
};
