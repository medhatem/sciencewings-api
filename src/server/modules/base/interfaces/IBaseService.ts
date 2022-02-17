import { AssignOptions } from '@mikro-orm/core';
import { Result } from '@utils/Result';

export abstract class IBaseService<T> {
  static getInstance: () => any;

  public get: (id: number) => Promise<any>;

  public getAll: () => Promise<Result<any[]>>;

  public create: (entry: T) => Promise<Result<any>>;

  public update: (entry: T) => Promise<Result<any>>;

  public remove: (id: number) => Promise<Result<number>>;

  getByCriteria: (criteria: { [key: string]: any }) => Promise<T>;

  public wrapEntity: (entity: T, payload: { [key: string]: any }, options: boolean | AssignOptions) => T;
}
