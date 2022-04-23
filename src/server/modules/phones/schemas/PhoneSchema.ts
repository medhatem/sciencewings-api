import Joi = require('joi');

export const CreateOrganizationPhoneSchema = Joi.object({
  phoneLabel: Joi.string().required(),

  phoneCode: Joi.string().required(),

  phoneNumber: Joi.string().required(),
});

export const UpdatePhoneSchema = Joi.object({
  id: Joi.number().required(),

  phoneLabel: Joi.string(),

  phoneCode: Joi.string(),

  phoneNumber: Joi.string(),
});
