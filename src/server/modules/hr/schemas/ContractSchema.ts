import Joi = require('joi');

const ContractSchema = Joi.object({
  contractType: Joi.string().allow(null, ''),
  dateEnd: Joi.date().allow(null, ''),
  supervisor: Joi.number().allow(null, ''),
  description: Joi.string().allow(null, ''),
});

export const CreateContractSchema = ContractSchema.keys({
  name: Joi.string().required().messages({ 'any.required': 'VALIDATION.NAME_REQUIRED' }),
  jobLevel: Joi.string().allow(null, ''),
  user: Joi.number().required().messages({ 'any.required': 'VALIDATION.USER_REQUIRED' }),
  dateStart: Joi.date().required().messages({ 'any.required': 'VALIDATION.DATESTART_REQUIRED' }),
  wage: Joi.number().allow(null, ''),
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
