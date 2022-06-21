import { AssignOptions, FindOneOptions, FindOptions } from '@mikro-orm/core';

import { FETCH_STRATEGY } from '../daos';
import { Result } from '@/utils/Result';

export abstract class IBaseService<T> {
  static getInstance: () => any;

  public get: (id: number) => Promise<any>;

  public getAll: () => Promise<Result<any[]>>;

  public create: (entry: T) => Promise<Result<any>>;

  public update: (entry: T) => Promise<Result<any>>;

  public updateRoute: (id: number, payload: any) => Promise<Result<any>>;

  public remove: (id: number) => Promise<Result<number>>;

  public removeRoute: (id: number) => Promise<Result<number>>;

  getByCriteria: (
    criteria: { [key: string]: any },
    fetchStrategy: FETCH_STRATEGY,
    options?: FindOptions<T> | FindOneOptions<T>,
  ) => Promise<Result<T>>;

  public wrapEntity: (entity: T, payload: { [key: string]: any }, options?: AssignOptions) => T;
}
