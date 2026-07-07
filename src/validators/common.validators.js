import Joi from 'joi';

/**
 * Reusable validation fragments.
 * Feature-specific validations compose these into full schemas.
 */
export const commonValidators = {
  /** MongoDB ObjectId */
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({ 'string.pattern.base': '{{#label}} must be a valid ObjectId' }),

  /** URL-safe slug */
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .messages({ 'string.pattern.base': '{{#label}} must be a valid slug (lowercase, hyphens only)' }),

  /** Pagination query parameters */
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().trim().default('-createdAt'),
  }),

  /** :id route parameter */
  idParam: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({ 'string.pattern.base': 'id must be a valid ObjectId' }),
  }),

  /** :courseSlug route parameter */
  courseSlugParam: Joi.object({
    courseSlug: Joi.string().trim().lowercase().required(),
  }),

  /** Non-empty trimmed string */
  requiredString: Joi.string().trim().min(1).required(),

  /** Optional trimmed string */
  optionalString: Joi.string().trim().allow(''),

  /** Boolean with default false */
  booleanDefault: (defaultVal = false) => Joi.boolean().default(defaultVal),

  /** Positive integer */
  positiveInt: Joi.number().integer().min(0),

  /** Email */
  email: Joi.string().trim().lowercase().email(),

  /** Password — at least 8 chars */
  password: Joi.string().min(8).max(128),
};
