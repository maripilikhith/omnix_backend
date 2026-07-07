import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const createAssessmentSchema = {
  body: Joi.object({
    topicId: commonValidators.objectId.required(),
    courseId: commonValidators.objectId.required(),
    title: commonValidators.requiredString,
    type: Joi.string().valid('quiz', 'test', 'practice').default('quiz'),
    questions: Joi.array().items(Joi.object({
      question: Joi.string().required(),
      options: Joi.array().items(Joi.string()).min(2).required(),
      correctIndex: Joi.number().integer().min(0).required(),
      explanation: commonValidators.optionalString,
      difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
      points: Joi.number().min(1).default(10),
    })).min(1).required(),
    passingScore: Joi.number().min(0).max(100).default(60),
    timeLimit: commonValidators.positiveInt.default(0),
    xpReward: commonValidators.positiveInt.default(50),
    isPublished: Joi.boolean().default(false),
  }),
};

export const submitAssessmentSchema = {
  body: Joi.object({
    assessmentId: commonValidators.objectId.required(),
    answers: Joi.array().items(Joi.number().integer().min(0)).required(),
  }),
};
