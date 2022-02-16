import 'reflect-metadata';
import { interfaces } from 'inversify';
import { Container } from './Container';
export { Container } from './Container';
export { injectable, inject, unmanaged } from 'inversify';
export declare const container: Container;
declare const lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
export { lazyInject };
/**
 * class level decorator to flag a class being a sigleton in the DI container
 *
 * @param identifier optional DI identifier of the decorated class if provided or defaults to the class itself
 */
export declare function provideSingleton(identifier?: interfaces.ServiceIdentifier<any>): (target: any) => any;
/**
 *
 * class level decorator to flag a class and provde an instance of it in the DI container
 *
 * @param identifier optional DI identifier of the decorated class if provided or defaults to the class itself
 */
export declare function provide(identifier?: interfaces.ServiceIdentifier<any>): (target: any) => any;
/**
 * lazily inject an identifier using inversify
 * this helps with circular dependencies
 * where it only injects when the property is used
 *
 * @param identifier the target that needs to be ingested
 */
export declare function ingest(identifier: interfaces.ServiceIdentifier<any>): (proto: any, key: string) => void;
