import { LocalStorage } from '@utils/LocalStorage';
import { v4 as uuidv4 } from 'uuid';

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
export function LoggerStorage(): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalFunction: any = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      LocalStorage.getInstance().enterWith({ id: uuidv4() }); //add a new uuid to the storage
      return originalFunction.apply(this, args);
    };
    return descriptor;
  };
}
