import { EntityRepository, GetRepository, IWrappedEntity } from '@mikro-orm/core';

import { BaseModel } from '@modules/base/models/BaseModel';
import { ServerError } from '../../../errors/ServerError';
import { connection } from '../../../db/index';
import { provideSingleton } from '../../../di';

@provideSingleton()
export class BaseDao<T extends BaseModel<T>> {
  public repository: GetRepository<T, EntityRepository<T>>;
  public instance: IWrappedEntity<T, never, any>;
  constructor(public model: T) {
    this.repository = connection.em.getRepository<T>(model.constructor as new () => T);
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  public async get(id: number): Promise<T> {
    return (this.repository as any).findOne(id);
  }

  /**
   * fetches using a given search criteria
   *
   * @param criteria the criteria to fetch with
   */
  async getByCriteria(criteria: { [key: string]: any }): Promise<T> {
    return await (this.repository as any).findOne(criteria);
  }

  public async getAll(): Promise<any> {
    return (this.repository as any).findAll();
  }

  public async create(entry: T): Promise<number> {
    const entity = (this.repository as any).create(entry); //generate an entity from a payload
    await this.repository.persistAndFlush(entity);
    return entity.id;
  }

  public async update(id: number, entry: any): Promise<any> {
    return (this.repository.nativeUpdate as any)(id, entry);
  }
}
