import Joi = require('joi');

export const UpdateResourceRateSchema = Joi.object({
  description: Joi.string(),
  rate: Joi.number(),
  category: Joi.string(),
  isPublic: Joi.boolean(),
  isRequiredAccountNumber: Joi.boolean(),
  duration: Joi.number(),
});

export const CreateResourceRateSchema = Joi.object({
  description: Joi.string().required().messages({ 'any.required': 'VALIDATION.DESCRIPTION_REQUIRED' }),
  rate: Joi.number().required().messages({ 'any.required': 'VALIDATION.RATE_REQUIRED' }),
  category: Joi.string().required().messages({ 'any.required': 'VALIDATION.CATEGORY_REQUIRED' }),
  isPublic: Joi.boolean().required().messages({ 'any.required': '' }),
  isRequiredAccountNumber: Joi.boolean().required(),
  duration: Joi.number().required().messages({ 'any.required': 'VALIDATION.DURATION_REQUIRED' }),
});
