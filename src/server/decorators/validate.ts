import * as Joi from 'joi';

import { parameterToValidateWithSchema, validateParamMetadataKey } from './validateParam';

import { ValidationError } from '@/Exceptions/ValidationError';

/**
 *
 * Method decorator which validates all the method's parameters
 * that are decorated with @validateParam
 * it uses the schema defined for each param and asynchronously validates it
 *
 * if no validation issues occured continue with the method execution
 * otherwise return a Result failiure with the error message
 *
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export function validate(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any {
  const originalFunction: any = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      const parametersToValidate: parameterToValidateWithSchema[] = Reflect.getOwnMetadata(
        validateParamMetadataKey,
        target,
        propertyKey,
      );
      await Promise.all(
        parametersToValidate.map(
          async (param: parameterToValidateWithSchema): Promise<any> => {
            const argumentToValidate = !!args.length && args[param.paramIndex];
            await (param['schema'] as Joi.ObjectSchema).validateAsync(argumentToValidate);
          },
        ),
      );
      return originalFunction.apply(this, args);
    } catch (error) {
      throw new ValidationError(error.message, { friendly: true });
    }
  };
  return descriptor;
}
