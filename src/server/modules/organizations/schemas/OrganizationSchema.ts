import Joi = require('joi');

const organizationSchema = Joi.object({
  members: Joi.array(),
  social: Joi.array(),
  address: Joi.array(),
  socialFacebook: Joi.string().allow(''),
  socialInstagram: Joi.string().allow(''),
  socialYoutube: Joi.string().allow(''),
  socialGithub: Joi.string().allow(''),
  socialTwitter: Joi.string().allow(''),
  socialLinkedin: Joi.string().allow(''),
  parent: Joi.number().allow(null),
  type: Joi.string(),
});

export const CreateOrganizationSchema = organizationSchema.keys({
  description: Joi.string().allow(''),
  name: Joi.string().required().messages({ 'any.required': 'VALIDATION.NAME_REQUIRED' }),
  email: Joi.string().email().required().messages({ 'any.required': 'VALIDATION.EMAIL_REQUIRED' }),
  phone: Joi.required().messages({ 'any.required': 'VALIDATION.PHONE_REQUIRED' }),
  address: Joi.object().required().messages({ 'any.required': 'VALIDATION.ADDRESS_REQUIRED' }),
  labels: Joi.array().required().messages({ 'any.required': 'VALIDATION.LABEL_REQUIRED' }),
  parent: Joi.number().allow(null),
  settings: Joi.object(),
});

export const UpdateOrganizationSchema = organizationSchema.keys({
  name: Joi.string(),
  description: Joi.string().allow(''),
  email: Joi.string().email(),
  phone: Joi.object(),
  labels: Joi.array(),
  owner: Joi.number(),
  adminContact: Joi.number(),
});

export const OrganizationMemberSettingsSchema = Joi.object({
  membersCanEditAccountNumbers: Joi.boolean(),
  promptForAccouantNumbers: Joi.boolean(),
  acountNumberNote: Joi.string(),
  allowMembersToSeeAllOtherMembers: Joi.boolean(),
});

export const OrganizationReservationSettingsSchema = Joi.object({
  approversCanEditReservations: Joi.boolean(),
  requireReasonWhenEditingReservation: Joi.boolean(),
  hideOrganizationCalendar: Joi.boolean(),
  hideAccountNumberWhenMakingReservation: Joi.string(),
  showResourceImagesInReservation: Joi.boolean(),
  confirmationEmailWhenMakingReservation: Joi.string().allow(''),
  attachedIcsCalendarFeeds: Joi.boolean(),
  emailAddressToReceiveReservationReplyMessages: Joi.array(),
});

export const OrganizationInvoicesSettingsSchema = Joi.object({
  membersCanEditBillingAddress: Joi.boolean(),
  defaultInvoiceDueDateUnit: Joi.string(),
  defaultInvoiceDueDate: Joi.number(),
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal: Joi.boolean(),
  lockInvoicedReservationsAndRequests: Joi.boolean(),
});

export const OrganizationAccessSettingsSchema = Joi.object({
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules: Joi.boolean(),
  joinCode: Joi.string(),
  yourOrganizationWillNeverAppearInSearchResults: Joi.boolean(),
  notifyAdministratorsWhenMembersJoinOrganization: Joi.boolean(),
  listResourceToNonMembers: Joi.boolean(),
  messageSentToNewMembers: Joi.string(),
});
