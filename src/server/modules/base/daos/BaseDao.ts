import { EntityManager, EntityRepository, QueryBuilder } from '@mikro-orm/postgresql';
import { FindOneOptions, FindOptions, GetRepository } from '@mikro-orm/core';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Logger } from '@/utils/Logger';
import { ServerError } from '@/Exceptions/ServerError';
import { connection } from '@/db/index';
import { log } from '@/decorators/log';
import { provideSingleton } from '@/di/index';

export enum FETCH_STRATEGY {
  'ALL' = 'ALL',
  'SINGLE' = 'SINGLE',
}

@provideSingleton()
export class BaseDao<T extends BaseModel<T>> {
  public repository: GetRepository<T, EntityRepository<T>>;
  public builder: QueryBuilder<T>;
  public logger: Logger;
  constructor(public model: T) {
    this.repository = ((connection.em as any) as EntityManager).getRepository<T>(model.constructor as new () => T);
    this.logger = Logger.getInstance();
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  @log()
  public async get(id: number, options?: FindOptions<T>): Promise<T> {
    return (this.repository as any).findOne(id, options);
  }

  /**
   * fetches record using a given search criteria
   *
   * @param criteria the criteria to fetch with
   * @param fetchStrategy were it return list or single matched record
   * @param options extra option for search
   */
  @log()
  async getByCriteria<Y extends keyof typeof FETCH_STRATEGY>(
    criteria: { [key: string]: any },
    fetchStrategy = FETCH_STRATEGY.SINGLE,
    options?: Y extends FETCH_STRATEGY.SINGLE ? FindOneOptions<T, never> : FindOptions<T, never>,
  ): Promise<T | T[]> {
    switch (fetchStrategy) {
      case FETCH_STRATEGY.ALL:
        return this.repository.find(criteria as any, options);
      case FETCH_STRATEGY.SINGLE:
        return this.repository.findOne(criteria as any, options);
      default:
        return (this.repository as any).findOne(criteria, options);
    }
  }

  @log()
  public async getAll(): Promise<T[]> {
    this.logger.info(`${this.model.constructor.name}s`);
    return (this.repository as any).findAll();
  }

  @log()
  public async create(entry: T): Promise<T> {
    const entity = (this.repository as any).create(entry); //generate an entity from a payload
    await this.repository.persistAndFlush(entity);
    return entity;
  }

  @log()
  public async update(entry: T): Promise<T> {
    await this.repository.persistAndFlush(entry);
    return entry;
  }

  @log()
  public async remove(entry: T): Promise<T> {
    await this.repository.nativeDelete(entry);
    return entry;
  }
  @log()
  public async removeEntity(entity: T): Promise<void> {
    await this.repository.removeAndFlush(entity);
  }
}
