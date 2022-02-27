import Joi = require('joi');

export const ProjectTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().required(),
  assigned: Joi.array().items(Joi.number()),
  active: Joi.boolean(),
  dateEnd: Joi.date(),
  parent: Joi.number(),
});

const ProjectSchema = Joi.object({
  active: Joi.boolean(),
  dateEnd: Joi.date(),
  tags: Joi.array().items(Joi.object()),
  tasks: Joi.array().items(ProjectTaskSchema.keys()),
});

export const CreateProjectSchema = ProjectSchema.keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  organization: Joi.number().required(),
  responsibles: Joi.array().items(Joi.number()).required(),
  participants: Joi.array().items(Joi.number()).required(),
  dateStart: Joi.date().required(),
});

export const UpdateProjectSchema = ProjectSchema.keys({
  title: Joi.string(),
  description: Joi.string(),
  organization: Joi.number(),
  responsibles: Joi.array().items(Joi.number()),
  participants: Joi.array().items(Joi.number()),
  dateStart: Joi.date(),
});
