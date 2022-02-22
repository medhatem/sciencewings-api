import { LogLevel, LogOptions, Logger } from '@/utils/Logger';

import { getConfig } from '../configuration/Configuration';

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

export function log(
  options: LogOptions = {
    level: LogLevel.DEBUG,
  },
): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalFunction: any = descriptor.value;
    const className: string = target.constructor.name;
    descriptor.value = async function (...args: any[]) {
      if (
        !getConfig('logger.displayAutoLogs') ||
        (options.displayLogs !== undefined && options.displayLogs === false)
      ) {
        return originalFunction.apply(this, args);
      }
      if (getConfig('logger.logLevel')) {
        options.level = getConfig('logger.logLevel');
      }
      const message = !options.message
        ? `in ${propertyKey} of ${className} with args: ${JSON.stringify(args)}`
        : options.message;
      const logger = Logger.getInstance();
      logger.logWithLevel(message, options.level);
      return originalFunction.apply(this, args);
    };
    return descriptor;
  };
}
