import Joi = require('joi');

const ContractSchema = Joi.object({
  active: Joi.boolean(),
  // structureType: PayrollStructureType,
  member: Joi.number(),
  group: Joi.number(),
  job: Joi.number(),
  dateEnd: Joi.date(),
  trialDateEnd: Joi.date(),
  resourceCalendar: Joi.number(),
  notes: Joi.string(),
  state: Joi.string(),
  // contractType: ContractType,
  kanbanState: Joi.string(),
  hrResponsible: Joi.number(),
});

export const CreateContractSchema = ContractSchema.keys({
  name: Joi.string().required(),
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
