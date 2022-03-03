import Joi = require('joi');

const MemberSchema = Joi.object({
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
  memberType: Joi.string().required(),
  identificationId: Joi.string(),
  studyField: Joi.string(),
  emergencyContact: Joi.string(),
  emergencyPhone: Joi.object(),
  notes: Joi.string(),
  departureDescription: Joi.string(),
  departureDate: Date,
  status: Joi.string(),
});

export const CreateMemberSchema = MemberSchema.keys({
  resource: Joi.number().required(),
  organization: Joi.number().required(),
});

export const UpdateMemberSchema = MemberSchema.keys({
  resource: Joi.number(),
  organization: Joi.number(),
});
