/**
 * method decorator that catches any potential errors
 * safe guard the error and return the corresponding Result
 *
 * @param isAsync determines if the decorated method is async
 */
export declare function safeGuard<T>(isAsync?: boolean): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any;
