import { AssignOptions, FindOneOptions, FindOptions } from '@mikro-orm/core';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';

export abstract class IBaseService<T extends BaseModel> {
  static getInstance: () => any;

  public get: (id: number, options?: FindOneOptions<T>) => Promise<T>;

  public getAll: () => Promise<T[]>;

  public create: (entry: T) => Promise<T>;

  public transactionalUpdate: (entry: T) => Promise<any>;

  public transactionalCreate: (entry: T) => Promise<any>;

  public flush: () => Promise<any>;

  public update: (entry: T) => Promise<any>;

  public updateRoute: (id: number, payload: any) => Promise<any>;

  public remove: (id: number) => Promise<T>;
  public removeWithCriteria: (payload: { [key: string]: any }) => Promise<void>;

  public removeRoute: (id: number) => Promise<void>;

  getByCriteria: (
    criteria: { [key: string]: any },
    fetchStrategy: FETCH_STRATEGY,
    options?: FindOptions<T> | FindOneOptions<T>,
  ) => Promise<T>;

  public wrapEntity: (entity: T, payload: { [key: string]: any }, options?: AssignOptions) => T;
}
