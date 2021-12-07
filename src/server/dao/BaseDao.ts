import { BaseModel } from '@models/BaseModel';
import { Repository } from 'typeorm';
import { ServerError } from '../errors/ServerError';
import { connection } from '../db/index';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseDao<T extends BaseModel<T>> {
  public repository: Repository<T>;
  constructor(model: T) {
    this.repository = connection.getRepository<T>(model.constructor as new () => T);
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  public async get(id: string): Promise<any> {
    return this.repository.findOne({ where: { id } });
  }

  public async getAll(): Promise<any> {
    return this.repository.find();
  }

  public async create(entry: T): Promise<any> {
    return this.repository.save(entry as any);
  }

  public async update(id: string, entry: any): Promise<any> {
    return this.repository.update(id, entry);
  }
}
