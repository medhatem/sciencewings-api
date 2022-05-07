import Joi = require('joi');

export enum OrganizationType {
  PUBLIC = 'Public',
  SERVICE = 'Service',
  INSTITUT = 'Institut',
}
const organizationSchema = Joi.object({
  members: Joi.array(),
  social: Joi.array(),
  addresses: Joi.array(),
  socialFacebook: Joi.string().allow(''),
  socialInstagram: Joi.string().allow(''),
  socialYoutube: Joi.string().allow(''),
  socialGithub: Joi.string().allow(''),
  socialTwitter: Joi.string().allow(''),
  socialLinkedin: Joi.string().allow(''),
  parent: Joi.number().allow(null),
});
export const CreateOrganizationSchema = organizationSchema.keys({
  name: Joi.string().required(),
  description: Joi.string().allow('').required(),
  email: Joi.string().email().required(),
  phones: Joi.array().required(),
  labels: Joi.array().required(),
  type: Joi.string()
    .valid(...Object.values(OrganizationType))
    .required(),
  direction: Joi.number().required(),
  adminContact: Joi.number().required(),
});
export const UpdateOrganizationSchema = organizationSchema.keys({
  name: Joi.string(),
  description: Joi.string().allow(''),
  email: Joi.string().email(),
  labels: Joi.array(),
  type: Joi.string().valid(...Object.values(OrganizationType)),
  direction: Joi.number(),
  adminContact: Joi.number(),
});
