import Joi from 'joi';

export const googleLoginSchema = {
  body: Joi.object({
    idToken: Joi.string().required().messages({
      'any.required': 'Google ID token is required',
      'string.empty': 'Google ID token cannot be empty',
    }),
  }),
};

export const refreshSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
