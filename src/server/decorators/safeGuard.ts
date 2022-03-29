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
        return Result.fail<T>(error.message);
      }
    };
    return descriptor;
  };
}
