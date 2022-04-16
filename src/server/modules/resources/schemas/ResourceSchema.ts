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
  resourceClass: Joi.string().required(),
});

export const UpdateResourceSchema = ResourceSchema.keys({
  name: Joi.string(),
  description: Joi.string(),
  resourceType: Joi.string(),
  resourceClass: Joi.string(),
});

export const ResourceGeneralStatusSchema = ResourceSchema.keys({
  statusType: Joi.string().required(),
  statusDescription: Joi.string().required(),
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
