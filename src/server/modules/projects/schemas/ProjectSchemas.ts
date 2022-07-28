import * as Joi from 'joi';

export const ProjectTaskSchema = Joi.object({
  title: Joi.string().required().messages({ 'any.required': 'VALIDATION.TITLE_REQUIRED' }),
  description: Joi.string().required().messages({ 'any.required': 'VALIDATION.DESCRIPTION_REQUIRED' }),
  priority: Joi.string().required(),
  assigned: Joi.array().items(Joi.number()),
  active: Joi.boolean(),
  dateStart: Joi.date(),
  parent: Joi.number(),
});

const ProjectSchema = Joi.object({
  active: Joi.boolean(),
  tags: Joi.array().items(Joi.object()),
  tasks: Joi.array().items(ProjectTaskSchema.keys()),
});

export const CreateProjectSchema = ProjectSchema.keys({
  title: Joi.string().required().messages({ 'any.required': 'VALIDATION.TITLE_REQUIRED' }),
  key: Joi.string().required().messages({ 'any.required': 'VALIDATION.KEY_REQUIRED' }),
  description: Joi.string().required().messages({ 'any.required': 'VALIDATION.DESCRIPTION_REQUIRED' }),
  organization: Joi.number().required(),
  dateStart: Joi.date().required().messages({ 'any.required': 'VALIDATION.DATESTART_REQUIRED' }),
  dateEnd: Joi.date().required().messages({ 'any.required': 'VALIDATION.DATESTART_REQUIRED' }),
});

export const UpdateProjectSchema = ProjectSchema.keys({
  title: Joi.string(),
  key: Joi.string(),
  description: Joi.string(),
  dateStart: Joi.date(),
  dateEnd: Joi.date(),
});
