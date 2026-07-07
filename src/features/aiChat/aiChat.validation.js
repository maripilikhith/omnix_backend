import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const sendMessageSchema = {
  body: Joi.object({
    message: commonValidators.requiredString,
    storyId: commonValidators.objectId,
    topicId: commonValidators.objectId,
    sessionId: commonValidators.objectId,
  }),
};
