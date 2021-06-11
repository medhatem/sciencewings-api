import { BaseDao } from '../dao/BaseDao';
import { IBase } from '../interface';
import { ServerError } from '../errors/ServerError';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseService<T extends IBase> {
  constructor(public dao: BaseDao<T>) {}

  static getInstance(): void {
    throw new ServerError('baseService must be overriden!');
  }

  public async get(id: string): Promise<T> {
    return await this.dao.get(id);
  }

  public async create(entry: T): Promise<any> {
    return this.dao.create(entry);
  }
}
