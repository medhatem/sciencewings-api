import Joi = require('joi');

const UserSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  email: Joi.string(),
  phones: Joi.array(),
  addresses: Joi.array(),
  dateofbirth: Joi.date(),
  keycloakId: Joi.string(),
});

export const CreateUserSchema = UserSchema.keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().required(),
  phones: Joi.array().required(),
  addresses: Joi.array().required(),
  dateofbirth: Joi.date().required(),
  keycloakId: Joi.string().required(),
});

export const UpdateUserSchema = UserSchema;
