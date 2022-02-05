import { LogLevel, LogOptions, Logger } from '@utils/Logger';

import { getConfig } from '../configuration/Configuration';

/**
 * Method decorator that logs when we use each method
 * along with the method name as well as its parameters
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
