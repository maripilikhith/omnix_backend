import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const createVideoQuestionSchema = {
  body: Joi.object({
    storyId: commonValidators.objectId.required(),
    topicId: commonValidators.objectId.required(),
    timestampSeconds: Joi.number().min(0).required(),
    question: commonValidators.requiredString,
    options: Joi.array().items(Joi.string().trim()).min(2).max(6).required(),
    correctIndex: Joi.number().integer().min(0).required(),
    explanation: commonValidators.optionalString,
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
    xpReward: commonValidators.positiveInt.default(10),
  }),
};
