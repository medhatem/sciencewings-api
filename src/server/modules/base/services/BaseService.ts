import { AssignOptions, wrap } from '@mikro-orm/core';

import { BaseDao } from '../daos/BaseDao';
import { BaseModel } from '@modules/base/models/BaseModel';
import { Keycloak } from '@sdks/keycloak';
import { Logger } from '../../../utils/Logger';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { ServerError } from '@errors/ServerError';
import { provideSingleton } from '../../../di';

@provideSingleton()
export class BaseService<T extends BaseModel<T>> {
  public logger: Logger;
  constructor(public dao: BaseDao<T>, public keycloak: Keycloak = Keycloak.getInstance()) {
    this.logger = Logger.getInstance();
  }

  static getInstance(): void {
    throw new ServerError('baseService must be overriden!');
  }

  public async get(id: number): Promise<T> {
    return await this.dao.get(id);
  }

  public async getAll(): Promise<T[]> {
    return await this.dao.getAll();
  }

  public async create(entry: T): Promise<T> {
    return this.dao.create(entry);
  }

  public async update(entry: T): Promise<T> {
    const entity = this.wrapEntity(this.dao.model, entry);
    return this.dao.update(entity);
  }

  @LoggerStorage()
  async getByCriteria(criteria: { [key: string]: any }): Promise<T> {
    return await this.getByCriteria(criteria);
  }

  /**
   * serialize a json object into an mikro-orm entity/model
   *
   * @param entity the entity/model to serialize on an return
   * @param payload the data to serialize
   * @param options for assign options
   *
   */
  public wrapEntity(entity: T, payload: { [key: string]: any }, options: boolean | AssignOptions = true): T {
    return wrap(entity).assign(payload, options);
  }
}
