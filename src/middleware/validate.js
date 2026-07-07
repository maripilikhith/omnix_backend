import { ValidationError } from '../utils/ApiError.js';

/**
 * Request validation middleware using Joi schemas.
 *
 * Validates req.body, req.params, and/or req.query against provided schemas.
 * Returns 400 with detailed validation errors on failure.
 *
 * Usage:
 *   import { createCourseSchema } from './course.validation.js';
 *   router.post('/courses', validate({ body: createCourseSchema }), controller.create);
 *
 * @param {object} schemas - Object with optional body, params, query Joi schemas
 * @returns {Function} Express middleware
 */
export const validate = (schemas) => {
  return (req, _res, next) => {
    const errors = [];

    for (const [source, schema] of Object.entries(schemas)) {
      if (!schema) continue;

      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, ''),
            source,
          });
        });
      } else {
        // Replace with sanitized/coerced values
        req[source] = value;
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  };
};
