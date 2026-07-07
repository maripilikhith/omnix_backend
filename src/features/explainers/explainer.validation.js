import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const createExplainerSchema = {
  body: Joi.object({
    courseId: commonValidators.objectId,
    moduleId: commonValidators.objectId,
    topicId: commonValidators.objectId,
    momentId: Joi.string().allow(''),
    storyTimestampSeconds: commonValidators.positiveInt,
    explainerSlug: commonValidators.requiredString,
    order: Joi.number().integer().min(1).default(1),
    title: commonValidators.requiredString,
    type: Joi.string().valid('TEXT', 'VIDEO', 'DOCUMENT').default('TEXT'),
    videoUrl: Joi.string().uri().allow('').default(''),
    documentUrl: Joi.string().uri().allow('').default(''),
    body: commonValidators.optionalString,
    storyConnect: commonValidators.optionalString,
    imageUrl: Joi.string().uri().allow('').default(''),
    formulaLatex: commonValidators.optionalString,
    xpReward: commonValidators.positiveInt,
    isPublished: Joi.boolean().default(true),
  }),
};

export const updateExplainerSchema = {
  params: commonValidators.idParam,
  body: Joi.object({
    courseId: commonValidators.objectId,
    moduleId: commonValidators.objectId,
    topicId: commonValidators.objectId,
    momentId: Joi.string().allow(''),
    storyTimestampSeconds: commonValidators.positiveInt,
    explainerSlug: Joi.string().trim(),
    order: Joi.number().integer().min(1),
    title: Joi.string().trim().min(1),
    type: Joi.string().valid('TEXT', 'VIDEO', 'DOCUMENT'),
    videoUrl: Joi.string().uri().allow(''),
    documentUrl: Joi.string().uri().allow(''),
    body: commonValidators.optionalString,
    storyConnect: commonValidators.optionalString,
    imageUrl: Joi.string().uri().allow(''),
    formulaLatex: commonValidators.optionalString,
    xpReward: commonValidators.positiveInt,
    isPublished: Joi.boolean(),
  }).min(1),
};

export const deleteExplainerSchema = { params: commonValidators.idParam };
