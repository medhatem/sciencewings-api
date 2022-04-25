import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

export const on = (eventName: string): any => {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalFunction: any = descriptor.value;
    eventEmitter.on(eventName, originalFunction);
    return descriptor;
  };
};
