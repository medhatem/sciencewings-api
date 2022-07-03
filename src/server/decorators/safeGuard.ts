import { Result } from '@/utils/Result';

/**
 * method decorator that catches any potential errors
 * safe guard the error and return the corresponding Result
 *
 * @param isAsync determines if the decorated method is async
 */
export function safeGuard<T>(
  isAsync = true,
): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalFunction: any = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        if (isAsync) {
          return await originalFunction.apply(this, args);
        }
        return originalFunction.apply(this, args);
      } catch (error) {
        if (error.response) {
          //check if the error is a keycloak based error
          if (error.response.data) {
            if (error.response.data.error === 'unknown_error') {
              return Result.fail(`Unknown error.`);
            } else if (error.response.data.error === 'HTTP 401 Unauthorized') {
              return Result.fail(`HTTP 401 Unauthorized.`);
            } else if (error.response.data.errorMessage.includes('already exists')) {
              const extractedName = new RegExp(/(?<=-)([\w]*)/g).exec(error.response.data.errorMessage);
              return Result.fail(`${extractedName[0]} already exist.`, true);
            }
          }
        }
        return Result.fail<T>(error.message);
      }
    };
    return descriptor;
  };
}
