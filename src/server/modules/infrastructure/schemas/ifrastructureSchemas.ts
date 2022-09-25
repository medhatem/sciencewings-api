import Joi = require('joi');
export const CreateOrganizationSchema = Joi.object({
  description: Joi.string().allow(''),
  name: Joi.string().required().messages({ 'any.required': 'VALIDATION.NAME_REQUIRED' }),
  key: Joi.string().required().messages({ 'any.required': 'VALIDATION.KEY_REQUIRED' }),
  default: Joi.boolean(),
  responsible: Joi.number(),
  parent: Joi.number().allow(null),
  organization: Joi.number().required().messages({ 'any.required': 'VALIDATION.ORGANIZATION_REQUIRED' }),
});
export const UpdateInfrastructureSchema = Joi.object({
  description: Joi.string().allow(''),
  name: Joi.string(),
  key: Joi.string(),
  responsible: Joi.number(),
  parent: Joi.number().allow(null),
  organization: Joi.number(),
});
