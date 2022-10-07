import Joi = require('joi');

export const JobSchema = Joi.object({
  name: Joi.string().required().required(),
  description: Joi.string(),
  organization: Joi.number().required(),
  contracts: Joi.array(),
  state: Joi.string().required(),
});
