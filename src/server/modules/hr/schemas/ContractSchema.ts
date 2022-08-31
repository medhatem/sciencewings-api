import Joi = require('joi');

const ContractSchema = Joi.object({
  contractType: Joi.string(),
  dateEnd: Joi.date(),
  supervisor: Joi.number(),
  description: Joi.string(),
});

export const CreateContractSchema = ContractSchema.keys({
  name: Joi.string().required(),
  jobLevel: Joi.string().required(),
  user: Joi.number().required(),
  dateStart: Joi.date().required(),
  wage: Joi.number().required(),
  organization: Joi.number().required(),
});

export const UpdateContractSchema = ContractSchema.keys({
  name: Joi.string(),
  dateStart: Joi.date(),
  wage: Joi.number(),
  organization: Joi.number(),
});
