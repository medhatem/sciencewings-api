import Joi = require('joi');

export const GroupSchema = Joi.object({
  active: Joi.boolean(),
  parent: Joi.number(),
  members: Joi.array(),
  note: Joi.string(),
});

export const CreateGroupSchema = GroupSchema.keys({
  name: Joi.string().required(),
  organization: Joi.number().required(),
});

export const UpdateGroupSchema = GroupSchema.keys({
  name: Joi.string(),
});
