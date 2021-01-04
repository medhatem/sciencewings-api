import 'reflect-metadata';

import * as Joi from 'joi';

import { IUser } from '../interface';

export const userValidationSchema = Joi.object<IUser>({
  username: Joi.string().alphanum().max(30).required().messages({
    'string.base': 'username should be of type string',
    'string.empty': 'username is a required field',
  }),
  firstName: Joi.string().min(1).message('firstName should at least have 1 character'),
  lastName: Joi.string().min(1).message('lastName should at least have 1 characte'),
  email: Joi.string().email().message('Wrong email!'),
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
  address: Joi.object({
    city: Joi.string().min(2).message('City is a required field').required(),
    appt: Joi.number().integer().min(0).message('Wrong appartment number'),
    zip: Joi.string().required().messages({
      'any.required': 'zip is required',
    }),
    street: Joi.string().min(3).message('Street is required').required(),
  }).optional(),
});
