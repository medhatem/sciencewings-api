import { LogOptions } from '@utils/Logger';
/**
 * Method decorator that logs information about the decorated method
 * such as method name, method class and parameters it was called with
 *
 * the options parameter allows to customize the logging
 * example:
 * options:{
 *   message?: string;
 *   level: LogLevel;
 *   displayLogs?: boolean; // set to true by default
 * }
 *
 * if message is provided that given message is displayed instead of the default
 * if level is provided then display logs accordingly
 * if displayLogs is set to false then do not display logs for the current decorated method
 *
 *
 *
 * @param options logging options
 */
export declare function log(options?: LogOptions): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any;
