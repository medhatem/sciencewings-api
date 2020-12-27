import * as Joi from 'joi';

import { IBase } from '../../interface';
import { ValidatonError } from '../../errors/ValidationError';

/**
 * validates the request body against a given Joi schema
 * adds an error argument to the decorated method
 * if the schema validation went wrong
 *
 * @param schema a given Joi schema containg validation definitions for a model
 */
export function validate<T extends IBase | object>(
  schema: Joi.ObjectSchema<T>,
): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalFunction: Function = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const bodyToValidate = !!args.length && args[0];
      try {
        await schema.validateAsync(bodyToValidate);
      } catch (error) {
        throw new ValidatonError(error.message);
      }
      return originalFunction.apply(this, args);
    };
    return descriptor;
  };
}
