import Joi = require('joi');

export const GroupSchema = Joi.object({
  name: Joi.string().required(),
  completeName: Joi.string(),
  active: Joi.boolean(),
  organization: Joi.number(),
  parent: Joi.number(),
  manager: Joi.number(),
  note: Joi.string(),
});
