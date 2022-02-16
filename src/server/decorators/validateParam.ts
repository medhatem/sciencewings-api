import 'reflect-metadata';

import * as Joi from 'joi';

export const validateParamMetadataKey = Symbol('validateParam');

export type parameterToValidateWithSchema = {
  paramIndex: number;
  schema: Joi.Schema;
};

/**
 * Parameter decorator which takes a Joi schema as a validator
 * declares that the decorator parameter needs to be validated
 * against the defined schema
 *
 * @param schema the Joi schema to validate against
 */
export function validateParam(
  schema: Joi.ObjectSchema,
): (target: Object, propertyKey: string | symbol, parameterIndex: number) => any {
  return async (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    let existingParamsToValidate: parameterToValidateWithSchema[] =
      Reflect.getOwnMetadata(validateParamMetadataKey, target, propertyKey) || [];
    existingParamsToValidate.push({
      paramIndex: parameterIndex,
      schema,
    });
    Reflect.defineMetadata(validateParamMetadataKey, existingParamsToValidate, target, propertyKey);
  };
}
