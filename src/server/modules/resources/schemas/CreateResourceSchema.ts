import Joi = require('joi');

const ResourceCalendarSchema = Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean(),
  organization: Joi.number(),
  hoursPerDay: Joi.number(),
  timezone: Joi.string().required(),
  twoWeeksCalendar: Joi.boolean(),
});

export default Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean(),
  organization: Joi.number(),
  resourceType: Joi.string().required(),
  user: Joi.number(),
  timeEfficiency: Joi.number().required(),
  timezone: Joi.string(),
  calendar: ResourceCalendarSchema.required(),
});
