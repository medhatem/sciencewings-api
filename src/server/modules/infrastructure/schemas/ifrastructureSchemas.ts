import Joi = require('joi');
const ResourceSchema = Joi.object({
  // base
  active: Joi.boolean(),
  organization: Joi.number(),
  user: Joi.number(),
  timezone: Joi.string(),
  tags: Joi.array(),
  managers: Joi.array(),
  // time restriction
  isEditingWindowForUsers: Joi.boolean(),
  isRestrictCreatingNewReservationBeforeTime: Joi.boolean(),
  isRestrictCreatingNewReservationAfterTime: Joi.boolean(),
  reservationTimeGranularity: Joi.string(),
  isAllowUsersToEndReservationEarly: Joi.boolean(),
  defaultReservationDuration: Joi.string(),
  reservationDurationMinimum: Joi.string(),
  reservationDurationMaximum: Joi.string(),
  bufferTimeBeforeReservation: Joi.string(),
});
export const UpdateInfrastructureSchema = ResourceSchema.keys({
  name: Joi.string(),
  description: Joi.string(),
  resourceType: Joi.string(),
  resourceClass: Joi.string(),
});
