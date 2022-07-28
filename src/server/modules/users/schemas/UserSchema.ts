import Joi = require('joi');

const UserSchema = Joi.object({
  firstname: Joi.string().allow(''),
  lastname: Joi.string().allow(''),
  email: Joi.string(),
  phones: Joi.array(),
  addresses: Joi.array(),
  dateofbirth: Joi.date(),
  keycloakId: Joi.string(),
});

export const CreateUserSchema = UserSchema.keys({
  firstname: Joi.string().required().messages({ 'any.required': 'VALIDATION.FIRSTNAME_REQUIRED' }),
  lastname: Joi.string().required().messages({ 'any.required': 'VALIDATION.LASTNAME_REQUIRED' }),
  email: Joi.string().required().messages({ 'any.required': 'VALIDATION.EMAIL_REQUIRED' }),
  phones: Joi.array().required().messages({ 'any.required': 'VALIDATION.PHONE_REQUIRED' }),
  addresses: Joi.array().required().messages({ 'any.required': 'VALIDATION.ADDRESS_REQUIRED' }),
  dateofbirth: Joi.date().required().messages({ 'any.required': 'VALIDATION.DATEOFBIRTH_REQUIRED' }),
  keycloakId: Joi.string().required(),
});

export const UpdateUserSchema = UserSchema;
