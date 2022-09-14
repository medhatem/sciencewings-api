import * as Joi from 'joi';

export const CreateReservationSchema = Joi.object({
  title: Joi.string().required().messages({ 'any.required': 'VALIDATION.TITLE_REQUIRED' }),
  start: Joi.date().required(),
  end: Joi.date().required(),
  userId: Joi.number().required(),
});
