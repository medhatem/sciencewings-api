import Joi = require('joi');
export const CreateOrganizationSchema = Joi.object({
  description: Joi.string().allow(''),
  name: Joi.string().required(),
  key: Joi.string().required(),
  resources: Joi.array(),
  responsables: Joi.array(),
  parent: Joi.number().allow(null),
  organization: Joi.number().required(),
});
export const UpdateInfrastructureSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  key: Joi.string(),
});
