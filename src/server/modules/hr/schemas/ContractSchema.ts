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
  jobName: Joi.string().allow(null, ''),
  state: Joi.string().allow(null, ''),
  jobLevel: Joi.string().allow(null, ''),
  user: Joi.number().allow(null, ''),
  dateStart: Joi.date().allow(null, ''),
  wage: Joi.number().allow(null, ''),
  organization: Joi.number().required().allow(null, ''),
});
