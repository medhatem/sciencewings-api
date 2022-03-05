import Joi = require('joi');

export const JobSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  organization: Joi.number(),
  group: Joi.number(),
  state: Joi.string(),
});
