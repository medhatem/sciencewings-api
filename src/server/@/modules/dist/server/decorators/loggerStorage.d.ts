/**
 * method decorator that sets an id into the local storage
 * the id is meant for tracing logs
 *
 * it is typicaly used on routes to create a unique id
 * and stace all the logs from that route
 * which improves debugging
 *
 *
 */
export declare function LoggerStorage(): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any;
