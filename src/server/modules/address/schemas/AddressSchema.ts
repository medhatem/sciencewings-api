import Joi = require('joi');

const organizationAddressSchema = Joi.object({
  apartment: Joi.string(),
  user: Joi.number(),
  organization: Joi.number(),
});

export const CreateOrganizationAddressSchema = organizationAddressSchema.keys({
  country: Joi.string().required().messages({ 'any.required': 'VALIDATION.COUNTRY_REQUIRED' }),
  province: Joi.string().required().messages({ 'any.required': 'VALIDATION.PROVINCE_REQUIRED' }),
  code: Joi.string().required().messages({ 'any.required': 'VALIDATION.CODE_REQUIRED' }),
  type: Joi.string().required().messages({ 'any.required': 'VALIDATION.TYPE_REQUIRED' }),
  city: Joi.string().required().messages({ 'any.required': 'VALIDATION.CITY_REQUIRED' }),
  street: Joi.string().required().messages({ 'any.required': 'VALIDATION.STREET_REQUIRED' }),
});

export const UpdateOrganizationAddressSchema = organizationAddressSchema.keys({
  id: Joi.number().required(),
  country: Joi.string(),
  province: Joi.string(),
  code: Joi.string(),
  type: Joi.string(),
  city: Joi.string(),
  street: Joi.string(),
});
