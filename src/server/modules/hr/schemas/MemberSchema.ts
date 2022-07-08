import Joi = require('joi');

export const MemberSchema = Joi.object({
  resource: Joi.number(),
  resourceCalendar: Joi.number(),
  name: Joi.string(),
  active: Joi.boolean(),
  group: Joi.number(),
  job: Joi.number(),
  jobTitle: Joi.string(),
  workPhone: Joi.object(),
  workEmail: Joi.string(),
  workLocation: Joi.object(),
  user: Joi.number(),
  parent: Joi.number(),
  coach: Joi.number(),
  memberType: Joi.string(),
  identificationId: Joi.string(),
  studyField: Joi.string(),
  emergencyContact: Joi.string(),
  emergencyPhone: Joi.object(),
  notes: Joi.string(),
  departureDescription: Joi.string(),
  departureDate: Date,
  status: Joi.string().valid(),
  membership: Joi.string().valid(),
});

export const CreateMemberSchema = MemberSchema.keys({
  organization: Joi.number().required(),
});

export const UpdateMemberSchema = MemberSchema.keys({
  organization: Joi.number(),
});

export const InviteMemberSchema = MemberSchema.keys({
  organizationId: Joi.number().required(),
  email: Joi.string().email().required().error(new Error('invalid email')),
});
