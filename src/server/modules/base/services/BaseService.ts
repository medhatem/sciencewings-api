import { AssignOptions, wrap } from '@mikro-orm/core';
import { BaseDao } from '../daos/BaseDao';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { IBaseService } from '../interfaces/IBaseService';
import { Keycloak } from '@/sdks/keycloak';
import { Logger } from '@/modules/../utils/Logger';
import { Result } from '@/utils/Result';
import { ServerError } from '@/errors/ServerError';
import { log } from '@/decorators/log';
import { provideSingleton } from '@/di';
import { safeGuard } from '@/decorators/safeGuard';
import { FETCH_STRATEGY } from '../daos/BaseDao';

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
    return Result.ok<any>(await this.dao.create(entry));
  }

  @log()
  @safeGuard()
  public async update(entry: T): Promise<Result<any>> {
    return Result.ok<any>(this.dao.update(entry));
  }

  @log()
  @safeGuard()
  public async updateRoute(id: number, payload: any): Promise<Result<any>> {
    const currentEntity = await this.dao.get(id);
    if (currentEntity === null) {
      if (!currentEntity) {
        return Result.notFound(`Entity with id ${id} does not exist.`);
      }
    }

    const entity = this.wrapEntity(currentEntity, {
      ...currentEntity,
      ...payload,
    });

    const result = await this.dao.update(entity);
    if (!result) {
      return Result.fail(`Entity with id ${id} can not be updated.`);
    }
    return Result.ok<any>(result);
  }

  @log()
  @safeGuard()
  public async remove(id: number): Promise<Result<number>> {
    const entity = this.wrapEntity(this.dao.model, { id });
    return Result.ok<any>(await this.dao.remove(entity));
  }

  @log()
  @safeGuard()
  public async removeRoute(id: number): Promise<Result<number>> {
    const currentEntity = await this.dao.get(id);
    if (currentEntity === null) {
      return Result.notFound(`Entity with id ${id} does not exist.`);
    }
    await this.dao.remove(currentEntity);
    return Result.ok<any>(currentEntity);
  }

  @log()
  @safeGuard()
  async getByCriteria(
    criteria: { [key: string]: any },
    fetchStrategy = FETCH_STRATEGY.SINGLE,
  ): Promise<Result<T | T[]>> {
    return Result.ok<any>(await this.dao.getByCriteria(criteria, fetchStrategy));
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
