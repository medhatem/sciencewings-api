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
  active: Joi.boolean(),
  organization: Joi.number(),
  user: Joi.number(),
  timezone: Joi.string(),
  tags: Joi.array(),
  managers: Joi.array(),
  calendar: Joi.array(),
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
export const ResourceSettingsReservationGeneralSchema = Joi.object({
  isEnabled: Joi.boolean(),
  isLoanable: Joi.boolean(),
  isReturnTheirOwnLoans: Joi.boolean(),
  isReservingLoansAtFutureDates: Joi.boolean(),
  fixedLoanDuration: Joi.string(),
  overdueNoticeDelay: Joi.string(),
  recurringReservations: Joi.string(),
});

export const ResourceSettingsReservationUnitSchema = Joi.object({
  unitName: Joi.string(),
  unitLimit: Joi.string(),
  unites: Joi.number(),
});
