import Joi from 'joi';
import { commonValidators } from '../../validators/index.js';

export const trackEventSchema = {
  body: Joi.object({
    eventType: commonValidators.requiredString,
    resource: Joi.string().trim(),
    resourceId: commonValidators.objectId,
    metadata: Joi.object(),
  }),
};
