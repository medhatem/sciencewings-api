import Joi = require('joi');
import { AddressType } from '@/modules/address/models/Address';

const organizationAddressSchema = Joi.object({
  apartment: Joi.string(),
  user: Joi.number(),
  organization: Joi.number(),
});

export const CreateOrganizationAddressSchema = organizationAddressSchema.keys({
  country: Joi.string().required(),
  province: Joi.string().required(),
  code: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(AddressType))
    .required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
});

export const UpdateOrganizationAddressSchema = organizationAddressSchema.keys({
  id: Joi.number().required(),
  country: Joi.string(),
  province: Joi.string(),
  code: Joi.string(),
  type: Joi.string().valid(...Object.values(AddressType)),
  city: Joi.string(),
  street: Joi.string(),
});
