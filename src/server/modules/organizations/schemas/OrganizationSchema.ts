import Joi = require('joi');
import { OrganizationType } from '../models/Organization';
import { DateUnit } from '../models/OrganizationSettings';

export const CreateOrganizationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  email: Joi.string().email().required(),
  phones: Joi.array(),
  labels: Joi.array(),
  type: Joi.string().valid(...Object.values(OrganizationType)),
  socialFacebook: Joi.string().allow(''),
  socialInstagram: Joi.string().allow(''),
  socialYoutube: Joi.string().allow(''),
  socialGithub: Joi.string().allow(''),
  socialTwitter: Joi.string().allow(''),
  socialLinkedin: Joi.string().allow(''),
  members: Joi.array(),
  social: Joi.array(),
  addresses: Joi.array(),
  direction: Joi.number().required(),
  adminContact: Joi.number().required(),
  parentId: Joi.number().allow(null),
  settings: Joi.object(),
});

export const OrganizationReservationSettingsSchema = Joi.object({
  approversCanEditReservations: Joi.boolean(),
  requireReasonWhenEditingReservation: Joi.boolean(),
  hideOrganizationCalendar: Joi.boolean(),
  hideAccountNumberWhenMakingReservation: Joi.boolean(),
  showResourceImagesInReservation: Joi.boolean(),
  confirmationEmailWhenMakingReservation: Joi.string().allow(''),
  attachedIcsCalendarFeeds: Joi.boolean(),
  emailAddressToReceiveReservationReplyMessages: Joi.array(),
});

export const OrganizationInvoicesSettingsSchema = Joi.object({
  membersCanEditBillingAddress: Joi.boolean(),
  defaultInvoiceDueDateUnit: Joi.string().valid(...Object.values(DateUnit)),
  defaultInvoiceDueDate: Joi.number(),
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal: Joi.boolean(),
  lockInvoicedReservationsAndRequests: Joi.boolean(),
});

export const OrganizationAccessSettingsSchema = Joi.object({
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules: Joi.boolean(),
  memberShouldAccessByJoinCode: Joi.boolean(),
  joinCode: Joi.string(),
  yourOrganizationWillNeverAppearInSearchResults: Joi.boolean(),
  notifyAdministratorsWhenMembersJoinOrganization: Joi.boolean(),
  listResourceToNonMembers: Joi.boolean(),
  messageSentToNewMembers: Joi.string(),
});
