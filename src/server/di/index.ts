import 'reflect-metadata';

import { injectable, interfaces } from 'inversify';

import { Container } from './Container';

export { Container } from './Container';
export { injectable, inject, unmanaged } from 'inversify';

export const container = new Container();

/**
 * class level decorator to flag a class being a sigleton in the DI container
 *
 * @param identifier optional DI identifier of the decorated class if provided or defaults to the class itself
 */
export function provideSingleton(identifier?: interfaces.ServiceIdentifier<any>): (target: any) => any {
  return (target: any): any => {
    container
      .bind(identifier || target)
      .to(target)
      .inSingletonScope();

    return injectable()(target);
  };
}

/**
 *
 * class level decorator to flag a class and provde an instance of it in the DI container
 *
 * @param identifier optional DI identifier of the decorated class if provided or defaults to the class itself
 */
export function provide(identifier?: interfaces.ServiceIdentifier<any>): (target: any) => any {
  return (target: any): any => {
    container.bind(identifier || target).to(target);
    return injectable()(target);
  };
}
