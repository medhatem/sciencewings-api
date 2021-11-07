import { BaseDao } from '../dao/BaseDao';
import { BaseModel } from '@models/BaseModel';
import { DocumentType } from '@typegoose/typegoose';
import { ServerError } from '@errors/ServerError';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseService<T extends BaseModel<T>> {
  constructor(public dao: BaseDao<T>) {}

  static getInstance(): void {
    throw new ServerError('baseService must be overriden!');
  }

  public async get(id: string): Promise<DocumentType<T>> {
    return await this.dao.get(id);
  }

  public async getAll(): Promise<DocumentType<T>[]> {
    return await this.dao.getAll();
  }

  public async create(entry: T): Promise<any> {
    return this.dao.create(entry);
  }

  public async update(id: string, entry: T): Promise<DocumentType<T>> {
    return this.dao.update(id, entry);
  }
}
