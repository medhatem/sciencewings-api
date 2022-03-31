import Joi = require('joi');

export const ResourceRateSchema = Joi.object({
  description: Joi.string(),
  rate: Joi.number(),
  category: Joi.string(),
  isPublic: Joi.boolean(),
  isRequiredAccountNumber: Joi.boolean(),
  duration: Joi.number(),
});

export const CreateResourceRateSchema = Joi.object({
  description: Joi.string().required(),
  rate: Joi.date().required(),
  category: Joi.date().required(),
  isPublic: Joi.boolean().required(),
  isRequiredAccountNumber: Joi.boolean().required(),
  duration: Joi.number().required(),
});
