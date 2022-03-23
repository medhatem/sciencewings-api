import Joi = require('joi');

export enum OrganizationType {
  PUBLIC = 'Public',
  SERVICE = 'Service',
  INSTITUT = 'Institut',
}

export const CreateOrganizationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  email: Joi.string().email().required(),
  phones: Joi.array(),
  labels: Joi.array(),
  type: Joi.string().valid(...Object.values(OrganizationType)),
  socialFacebook: Joi.string().allow(null, ''),
  socialInstagram: Joi.string().allow(null, ''),
  socialYoutube: Joi.string().allow(null, ''),
  socialGithub: Joi.string().allow(null, ''),
  socialTwitter: Joi.string().allow(null, ''),
  socialLinkedin: Joi.string().allow(null, ''),
  members: Joi.array(),
  social: Joi.array(),
  addresses: Joi.array(),
  direction: Joi.number().required(),
  adminContact: Joi.number().required(),
  parentId: Joi.number().allow(null),
});
