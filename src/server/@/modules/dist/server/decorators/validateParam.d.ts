import 'reflect-metadata';
import * as Joi from 'joi';
export declare const validateParamMetadataKey: unique symbol;
export declare type parameterToValidateWithSchema = {
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
export declare function validateParam(schema: Joi.ObjectSchema): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
