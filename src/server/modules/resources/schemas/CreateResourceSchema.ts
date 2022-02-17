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
});

export const CreateResourceSchema = ResourceSchema.keys({
  name: Joi.string().required(),
  resourceType: Joi.string().required(),
  timeEfficiency: Joi.number().required(),
  calendar: ResourceCalendarSchema.required(),
});

export const UpdateResourceSchema = ResourceSchema.keys({
  name: Joi.string(),
  resourceType: Joi.string(),
  timeEfficiency: Joi.number(),
  calendar: ResourceCalendarSchema,
});
