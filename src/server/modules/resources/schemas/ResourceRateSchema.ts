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
  description: Joi.string().required(),
  rate: Joi.number().required(),
  category: Joi.string().required(),
  isPublic: Joi.boolean().required(),
  isRequiredAccountNumber: Joi.boolean().required(),
  duration: Joi.number().required(),
});
