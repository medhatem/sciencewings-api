import * as Joi from 'joi';

import { ICredentials } from '../interface';

export const userCredentialsSchema = Joi.object<ICredentials>({
  email: Joi.string().email().required().messages({
    'string.email': 'wrong email format',
    'any.required': 'email is required',
  }),
  password: Joi.string().required().messages({ 'any.required': 'password is required' }),
});
