import { BaseModel } from '@models/BaseModel';
import { GetRepository } from '@mikro-orm/core';
import { ServerError } from '../errors/ServerError';
import { connection } from '../db/index';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseDao<T extends BaseModel<T>> {
  public repository: GetRepository<T, any>;
  constructor(public model: T) {
    this.repository = connection.em.getRepository<T>(model.constructor as new () => T);
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  public async get(id: string): Promise<any> {
    return this.repository.findOne(id);
  }

  public async getAll(): Promise<any> {
    return this.repository.findAll();
  }

  public async create(entry: T): Promise<number> {
    const user = this.repository.create(entry); //generate an entity from a payload
    await this.repository.persistAndFlush(user);
    return user.id;
  }

  public async update(id: string, entry: any): Promise<any> {
    return this.repository.nativeUpdate(id, entry);
  }
}
