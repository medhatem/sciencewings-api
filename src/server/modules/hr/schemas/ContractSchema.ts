import Joi = require('joi');

const ContractSchema = Joi.object({
  contractType: Joi.string(),
  dateEnd: Joi.date(),
  supervisor: Joi.number(),
  description: Joi.string(),
});

export const CreateContractSchema = ContractSchema.keys({
  name: Joi.string().required().messages({ 'any.required': 'VALIDATION.NAME_REQUIRED' }),
  jobLevel: Joi.string().required().messages({ 'any.required': 'VALIDATION.JOBLEVEL_REQUIRED' }),
  user: Joi.number().required().messages({ 'any.required': 'VALIDATION.USER_REQUIRED' }),
  dateStart: Joi.date().required().messages({ 'any.required': 'VALIDATION.DATESTART_REQUIRED' }),
  wage: Joi.number().required().messages({ 'any.required': 'VALIDATION.WAGE_REQUIRED' }),
  organization: Joi.number().required().messages({ 'any.required': 'VALIDATION.ORGANIZATION_REQUIRED' }),
});

export const UpdateContractSchema = ContractSchema.keys({
  jobName: Joi.string(),
  state: Joi.string(),
  jobLevel: Joi.string(),
  user: Joi.number(),
  dateStart: Joi.date(),
  wage: Joi.number(),
  organization: Joi.number().required(),
});
