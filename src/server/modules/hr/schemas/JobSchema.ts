import Joi = require('joi');

export const JobSchema = Joi.object({
  name: Joi.string().required().required(),
  description: Joi.string(),
  organization: Joi.number().required(),
  state: Joi.string().required(),
});
