import Joi = require('joi');

const UserSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  email: Joi.string(),
  phones: Joi.array(),
  address: Joi.array(),
  dateofbirth: Joi.date(),
  keycloakId: Joi.string(),
});

export const CreateUserSchema = UserSchema.keys({
  firstname: Joi.string().required().messages({ 'any.required': 'VALIDATION.FIRSTNAME_REQUIRED' }),
  lastname: Joi.string().required().messages({ 'any.required': 'VALIDATION.LASTNAME_REQUIRED' }),
  email: Joi.string().required().messages({ 'any.required': 'VALIDATION.EMAIL_REQUIRED' }),
  phones: Joi.array().required().messages({ 'any.required': 'VALIDATION.PHONE_REQUIRED' }),
  address: Joi.object().required().messages({ 'any.required': 'VALIDATION.ADDRESS_REQUIRED' }),
  dateofbirth: Joi.date().required().messages({ 'any.required': 'VALIDATION.DATEOFBIRTH_REQUIRED' }),
  keycloakId: Joi.string().required(),
});

export const UpdateUserSchema = UserSchema;
