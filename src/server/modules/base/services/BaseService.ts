import { AssignOptions, wrap } from '@mikro-orm/core';

import { BaseDao } from '../daos/BaseDao';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { IBaseService } from '../interfaces/IBaseService';
import { Keycloak } from '@/sdks/keycloak';
import { Logger } from '@/modules/../utils/Logger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Result } from '@/utils/Result';
import { ServerError } from '@/errors/ServerError';
import { log } from '@/decorators/log';
import { provideSingleton } from '@/di';
import { safeGuard } from '@/decorators/safeGuard';

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
  @safeGuard()
  public async get(id: number): Promise<Result<any>> {
    return Result.ok<any>(await this.dao.get(id));
  }

  @log()
  @safeGuard()
  public async getAll(): Promise<Result<any[]>> {
    return Result.ok<any>(await this.dao.getAll());
  }

  @log()
  @safeGuard()
  public async create(entry: T): Promise<Result<any>> {
    try {
      return Result.ok<any>(await this.dao.create(entry));
    } catch (error) {
      return Result.fail(error);
    }
  }

  @log()
  @safeGuard()
  public async update(entry: T): Promise<Result<any>> {
    try {
      return Result.ok<any>(this.dao.update(entry));
    } catch (error) {
      return Result.fail(error);
    }
  }

  @log()
  @safeGuard()
  public async remove(id: number): Promise<Result<number>> {
    try {
      const entity = this.wrapEntity(this.dao.model, { id });
      return Result.ok<any>(await this.dao.remove(entity));
    } catch (error) {
      return Result.fail(error);
    }
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
  public wrapEntity(entity: T, payload: any, options: boolean | AssignOptions = true): T {
    return wrap(entity).assign(payload, options);
  }
}
