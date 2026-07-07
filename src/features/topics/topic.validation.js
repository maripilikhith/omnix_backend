import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const createTopicSchema = {
  body: Joi.object({
    courseId: commonValidators.objectId.required(),
    moduleId: commonValidators.objectId.required(),
    courseSlug: commonValidators.requiredString,
    topicSlug: commonValidators.requiredString,
    number: Joi.number().integer().min(1).required(),
    title: commonValidators.requiredString,
    description: commonValidators.optionalString,
    storyCount: commonValidators.positiveInt,
    explainerCount: commonValidators.positiveInt,
    hasAssessment: Joi.boolean().default(false),
    assessmentXpReward: commonValidators.positiveInt,
    xpReward: commonValidators.positiveInt,
    isLocked: Joi.boolean().default(false),
    prerequisiteTopicId: commonValidators.objectId.allow(null),
    isPublished: Joi.boolean().default(false),
  }),
};

export const updateTopicSchema = {
  params: commonValidators.idParam,
  body: Joi.object({
    courseId: commonValidators.objectId,
    moduleId: commonValidators.objectId,
    courseSlug: Joi.string().trim(),
    topicSlug: Joi.string().trim(),
    number: Joi.number().integer().min(1),
    title: Joi.string().trim().min(1),
    description: commonValidators.optionalString,
    storyCount: commonValidators.positiveInt,
    explainerCount: commonValidators.positiveInt,
    hasAssessment: Joi.boolean(),
    assessmentXpReward: commonValidators.positiveInt,
    xpReward: commonValidators.positiveInt,
    isLocked: Joi.boolean(),
    prerequisiteTopicId: commonValidators.objectId.allow(null),
    isPublished: Joi.boolean(),
  }).min(1),
};

export const deleteTopicSchema = { params: commonValidators.idParam };
