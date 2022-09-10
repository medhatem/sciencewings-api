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

export const CreateResourceSchema = ResourceSchema.keys({
  name: Joi.string().required(),
  description: Joi.string(),
  organization: Joi.number().required(),
  resourceType: Joi.string().required(),
  resourceClass: Joi.string().required(),
});

export const UpdateResourceSchema = ResourceSchema.keys({
  organization: Joi.number().required(),
  name: Joi.string(),
  description: Joi.string(),
  resourceType: Joi.string(),
  resourceClass: Joi.string(),
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

export const ResourceReservationVisibilitySchema = Joi.object({
  isReservationDetailsVisibilityToNonModerators: Joi.boolean().required(),
});

export const ResourceGeneralStatusSchema = ResourceSchema.keys({
  resourceType: Joi.string(),
  statusType: Joi.string(),
  statusDescription: Joi.string().required(),
  user: Joi.number().required(),
  organization: Joi.number().required(),
});

export const ResourceGeneralVisibilitySchema = ResourceSchema.keys({
  visibility: Joi.boolean().required(),
  isUnlistedOnOrganizationPage: Joi.boolean().required(),
  isUnlistedToUsersWhoCannotReserve: Joi.boolean().required(),
  isFullyHiddentoUsersWhoCannotReserve: Joi.boolean().required(),
  isPromotedOnSitePageAsALargeButtonAboveOtherResources: Joi.boolean().required(),
  isHideAvailabilityonSitePage: Joi.boolean().required(),
});

export const ResourceGeneralPropertiesSchema = ResourceSchema.keys({
  accessToResource: Joi.string().required(),
});
