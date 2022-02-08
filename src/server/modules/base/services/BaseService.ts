import { AssignOptions, wrap } from '@mikro-orm/core';

import { BaseDao } from '../daos/BaseDao';
import { BaseModel } from '@modules/base/models/BaseModel';
import { Keycloak } from '@sdks/keycloak';
import { Logger } from '../../../utils/Logger';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { ServerError } from '@errors/ServerError';
import { provideSingleton } from '../../../di';
import { Result } from '@utils/Result';

@provideSingleton()
export class BaseService<T extends BaseModel<T>> {
  public logger: Logger;
  constructor(public dao: BaseDao<T>, public keycloak: Keycloak = Keycloak.getInstance()) {
    this.logger = Logger.getInstance();
  }

  static getInstance(): void {
    throw new ServerError('baseService must be overriden!');
  }

  public async get(id: number): Promise<any> {
    return await this.dao.get(id);
  }

  public async getAll(): Promise<Result<any>> {
    try {
      return Result.ok<any>(await this.dao.getAll());
    } catch (error) {
      return Result.fail<any>(error);
    }
  }

  public async create(entry: T): Promise<Result<any>> {
    try {
      return Result.ok<any>(this.dao.create(entry));
    } catch (error) {
      return Result.fail<any>(error);
    }
  }

  public async update(entry: T): Promise<Result<any>> {
    try {
      const entity = this.wrapEntity(this.dao.model, entry);
      return Result.ok<any>(this.dao.update(entity));
    } catch (error) {
      return Result.fail<any>(error);
    }
  }

  public async remove(id: number): Promise<Result<number>> {
    const entity = this.wrapEntity(this.dao.model, { id });
    return Result.ok<any>(await this.dao.remove(entity));
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
