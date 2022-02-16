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
export declare function validate(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any;
