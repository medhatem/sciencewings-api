import Joi = require('joi');

export enum OrganizationType {
  PUBLIC = 'Public',
  SERVICE = 'Service',
  INSTITUT = 'Institut',
}

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
});
