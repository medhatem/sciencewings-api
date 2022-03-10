import Joi = require('joi');

export enum OrganizationType {
  PUBLIC = 'Public',
  SERVICE = 'Service',
  INSTITUT = 'Institut',
}

export default Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phones: Joi.array(),
  labels: Joi.array(),
  type: Joi.string().valid(...Object.values(OrganizationType)),
  socialFacebook: Joi.string(),
  socialInstagram: Joi.string(),
  socialYoutube: Joi.string(),
  socialGithub: Joi.string(),
  socialTwitter: Joi.string(),
  socialLinkedin: Joi.string(),
  members: Joi.array(),
  social: Joi.array(),
  addresses: Joi.array(),
  direction: Joi.number().required(),
  adminContact: Joi.number().required(),
});
