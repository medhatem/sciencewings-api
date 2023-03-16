import { AssignOptions, wrap } from '@mikro-orm/core';
import { BaseDao, FETCH_STRATEGY } from '../daos/BaseDao';
import { FindOneOptions, FindOptions } from '@mikro-orm/core/drivers/IDatabaseDriver';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { IBaseService } from '../interfaces/IBaseService';
import { Keycloak } from '@/sdks/keycloak';
import { Logger } from '@/utils/Logger';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { ServerError } from '@/Exceptions/ServerError';
import { log } from '@/decorators/log';
import { provideSingleton } from '@/di';
import { EntityManager } from '@mikro-orm/postgresql';

@provideSingleton(IBaseService)
export class BaseService<T extends BaseModel<T>> implements IBaseService<any> {
  public logger: Logger;
  constructor(public dao: BaseDao<T>, public keycloak: Keycloak = Keycloak.getInstance()) {
    this.logger = Logger.getInstance();
  }

  static getInstance(): void {
    throw new ServerError('baseService must be overriden!');
  }

  @log()
  public async get(id: number, options?: FindOptions<T>): Promise<any> {
    return await this.dao.get(id, options);
  }

  @log()
  public async getAll(): Promise<T[]> {
    return this.dao.getAll();
  }

  @log()
  public async create(entry: T): Promise<T> {
    return this.dao.create(entry);
  }

  @log()
  public async update(entry: T): Promise<any> {
    return this.dao.update(entry);
  }
  @log()
  public async fork(): Promise<EntityManager> {
    return this.dao.fork();
  }

  @log()
  public async flush(): Promise<any> {
    this.dao.entitymanager.flush();
  }

  @log()
  public async transactionalUpdate(entry: T): Promise<any> {
    return this.dao.transactionalUpdate(entry);
  }

  @log()
  public async transactionalCreate(entry: T): Promise<any> {
    return this.dao.transactionalCreate(entry);
  }

  @log()
  public async updateRoute(id: number, payload: any): Promise<any> {
    const currentEntity = await this.dao.get(id);
    if (!currentEntity) {
      throw new NotFoundError('ENTITY.NON_EXISTANT');
    }

    const entity = this.wrapEntity(currentEntity, {
      ...currentEntity,
      ...payload,
    });

    const result = await this.dao.update(entity);

    return result;
  }

  @log()
  public async remove(id: number): Promise<T> {
    const entity = this.wrapEntity(this.dao.model, { id });
    return await this.dao.remove(entity);
  }

  @log()
  public async removeWithCriteria(payload: { [key: string]: any }): Promise<void> {
    const entity = (await this.dao.getByCriteria(payload)) as T;
    await this.dao.removeEntity(entity);
  }

  @log()
  public async removeRoute(id: number): Promise<void> {
    const currentEntity = await this.dao.get(id);
    if (!currentEntity) {
      throw new NotFoundError('ENTITY.NON_EXISTANT');
    }
    await this.dao.remove(currentEntity);
  }

  @log()
  async getByCriteria<Y extends keyof typeof FETCH_STRATEGY>(
    criteria: { [key: string]: any },
    fetchStrategy = FETCH_STRATEGY.SINGLE,
    options?: Y extends FETCH_STRATEGY.SINGLE ? FindOneOptions<T, never> : FindOptions<T, never>,
  ): Promise<T | T[]> {
    return await this.dao.getByCriteria(criteria, fetchStrategy, options);
  }

  /**
   * serialize a json object into an mikro-orm entity/model
   *
   * @param entity the entity/model to serialize on an return
   * @param payload the data to serialize
   * @param options for assign options
   *
   */
  public wrapEntity(entity: T, payload: any, options: AssignOptions = {}): T {
    return wrap(entity).assign(payload, options);
  }
}
