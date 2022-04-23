import Joi = require('joi');
import { AddressType } from '../models/Address';

export const CreateOrganizationAddressSchema = Joi.object({
  country: Joi.string().required(),
  province: Joi.string().required(),
  code: Joi.string().required(),
  type: Joi.string().valid(...Object.values(AddressType)),
  city: Joi.string().required(),
  street: Joi.string().required(),
  apartment: Joi.string(),
  user: Joi.number(),
  organization: Joi.number(),
});

export const UpdateOrganizationAddressSchema = Joi.object({
  id: Joi.number().required(),
  country: Joi.string(),
  province: Joi.string(),
  code: Joi.string(),
  type: Joi.string().valid(...Object.values(AddressType)),
  city: Joi.string(),
  street: Joi.string(),
  apartment: Joi.string(),
  user: Joi.number(),
  organization: Joi.number(),
});
