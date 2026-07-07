import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const createStorySchema = {
  body: Joi.object({
    courseId: commonValidators.objectId.required(),
    moduleId: commonValidators.objectId.required(),
    topicId: commonValidators.objectId.required(),
    order: Joi.number().integer().min(1).required(),
    storySlug: commonValidators.requiredString,
    title: commonValidators.requiredString,
    synopsis: commonValidators.optionalString,
    videoUrl: Joi.string().uri().required(),
    durationSeconds: Joi.number().integer().min(1).required(),
    thumbnailUrl: Joi.string().uri().allow('').default(''),
    transcript: commonValidators.optionalString,
    subtitlesUrl: Joi.string().uri().allow('').default(''),
    moments: Joi.array().items(Joi.object({
      momentId: Joi.string().required(),
      timestampSeconds: Joi.number().min(0).required(),
      label: Joi.string().trim().required(),
    })).default([]),
    narrativeStyle: Joi.string().trim().default('cinematic'),
    characters: Joi.array().items(Joi.string().trim()).default([]),
  }),
};

export const updateStorySchema = {
  params: commonValidators.idParam,
  body: Joi.object({
    courseId: commonValidators.objectId,
    moduleId: commonValidators.objectId,
    topicId: commonValidators.objectId,
    order: Joi.number().integer().min(1),
    storySlug: Joi.string().trim(),
    title: Joi.string().trim().min(1),
    synopsis: commonValidators.optionalString,
    videoUrl: Joi.string().uri(),
    durationSeconds: Joi.number().integer().min(1),
    thumbnailUrl: Joi.string().uri().allow(''),
    transcript: commonValidators.optionalString,
    subtitlesUrl: Joi.string().uri().allow(''),
    moments: Joi.array().items(Joi.object({
      momentId: Joi.string().required(),
      timestampSeconds: Joi.number().min(0).required(),
      label: Joi.string().trim().required(),
    })),
    narrativeStyle: Joi.string().trim(),
    characters: Joi.array().items(Joi.string().trim()),
  }).min(1),
};

export const deleteStorySchema = { params: commonValidators.idParam };
