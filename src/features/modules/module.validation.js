import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const createModuleSchema = {
  body: Joi.object({
    courseId: commonValidators.objectId.required(),
    courseSlug: commonValidators.requiredString,
    moduleSlug: commonValidators.requiredString,
    number: Joi.number().integer().min(1).required(),
    title: commonValidators.requiredString,
    description: commonValidators.optionalString,
    totalTopics: commonValidators.positiveInt,
    totalDurationSeconds: commonValidators.positiveInt,
    isLocked: Joi.boolean().default(false),
    prerequisiteModuleId: commonValidators.objectId.allow(null),
    checkpointQuiz: Joi.array().items(
      Joi.object({
        question: Joi.string().trim().required(),
        options: Joi.array().items(Joi.string()).length(4).required(),
        correctIndex: Joi.number().integer().min(0).max(3).required(),
        explanation: Joi.string().trim().allow(''),
      }),
    ).default([]),
    isPublished: Joi.boolean().default(true),
  }),
};

export const updateModuleSchema = {
  params: commonValidators.idParam,
  body: Joi.object({
    courseId: commonValidators.objectId,
    courseSlug: Joi.string().trim(),
    moduleSlug: Joi.string().trim(),
    number: Joi.number().integer().min(1),
    title: Joi.string().trim().min(1),
    description: commonValidators.optionalString,
    totalTopics: commonValidators.positiveInt,
    totalDurationSeconds: commonValidators.positiveInt,
    isLocked: Joi.boolean(),
    prerequisiteModuleId: commonValidators.objectId.allow(null),
    checkpointQuiz: Joi.array().items(Joi.object({
      question: Joi.string().trim().required(),
      options: Joi.array().items(Joi.string()).length(4).required(),
      correctIndex: Joi.number().integer().min(0).max(3).required(),
      explanation: Joi.string().trim().allow(''),
    })),
    isPublished: Joi.boolean(),
  }).min(1),
};

export const deleteModuleSchema = { params: commonValidators.idParam };
