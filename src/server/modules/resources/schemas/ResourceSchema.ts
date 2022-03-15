import Joi = require('joi');

export const ResourceCalendarSchema = Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean(),
  organization: Joi.number(),
  hoursPerDay: Joi.number(),
  timezone: Joi.string().required(),
  twoWeeksCalendar: Joi.boolean(),
});

const ResourceSchema = Joi.object({
  active: Joi.boolean(),
  organization: Joi.number(),
  user: Joi.number(),
  timezone: Joi.string(),

  tags: Joi.array(),
});

export const CreateResourceSchema = ResourceSchema.keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  resourceType: Joi.string().required(),
  calendar: ResourceCalendarSchema.required(),
});

export const UpdateResourceSchema = ResourceSchema.keys({
  name: Joi.string(),
  description: Joi.string(),
  resourceType: Joi.string(),
  calendar: ResourceCalendarSchema,
});
