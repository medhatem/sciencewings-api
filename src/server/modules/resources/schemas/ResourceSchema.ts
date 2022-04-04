import Joi = require('joi');

export const ResourceEventSchema = Joi.object({
  title: Joi.string().required(),
  dateFrom: Joi.date().required(),
  dateTo: Joi.date().required(),
});

export const ResourceCalendarSchema = Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean(),
  organization: Joi.number(),
  hoursPerDay: Joi.number(),
  timezone: Joi.string().required(),
  twoWeeksCalendar: Joi.boolean(),
});

const ResourceSchema = Joi.object({
  // base
  active: Joi.boolean(),
  organization: Joi.number(),
  user: Joi.number(),
  timezone: Joi.string(),
  tags: Joi.array(),
  managers: Joi.array(),
  calendar: Joi.array(),
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

export const CreateResourceSchema = ResourceSchema.keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  resourceType: Joi.string().required(),
});

export const UpdateResourceSchema = ResourceSchema.keys({
  name: Joi.string(),
  description: Joi.string(),
  resourceType: Joi.string(),
});
//Resource Settings
export const ResourceReservationGeneralSchema = Joi.object({
  isEnabled: Joi.boolean(),
  isLoanable: Joi.boolean(),
  isReturnTheirOwnLoans: Joi.boolean(),
  isReservingLoansAtFutureDates: Joi.boolean(),
  fixedLoanDuration: Joi.string(),
  overdueNoticeDelay: Joi.string(),
  recurringReservations: Joi.string(),
});

export const ResourceReservationUnitSchema = Joi.object({
  unitName: Joi.string(),
  unitLimit: Joi.number(),
  unites: Joi.number(),
});
