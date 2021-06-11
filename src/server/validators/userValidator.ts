import * as Joi from 'joi';

import { IAddress, IUser, IUserProfessionalMetadata } from '../interface';

export const userValidationSchema = Joi.object<IUser>({
  firstName: Joi.string().min(1).message('firstName should at least have 1 character'),
  lastName: Joi.string().min(1).message('lastName should at least have 1 characte'),
  email: Joi.string()
    .email()
    .message('Wrong email!')
    .required()
    .messages({ 'any.required': 'the email is a required field' }),
  /*
     password must have
     Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  */
  password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).message(`
        Password should have:
        - minimun 8 characters
        - at least one uppercase letter
        - at least one lowercase letter
        - one number and one special character
    `),
  address: Joi.object<IAddress>({
    city: Joi.string().min(2).message('City is a required field').required(),
    appt: Joi.number().integer().min(0).message('Wrong appartment number'),
    zip: Joi.string().required().messages({
      'any.required': 'zip is required',
    }),
    street: Joi.string().min(3).message('Street is required').required(),
  }).optional(),
  professional: Joi.object<IUserProfessionalMetadata>({
    isProfessional: Joi.boolean().required().messages({
      'any.required': 'isProfessional field is required',
    }),
    job: Joi.alternatives().conditional('isProfessional', {
      is: true,
      then: Joi.string().required().messages({ 'any.required': 'professional job field is required' }),
      otherwise: Joi.string().optional(),
    }),
  }).optional(),
});
