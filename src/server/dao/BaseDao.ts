import { BaseModel } from '@models/BaseModel';
import { Repository } from 'sequelize-typescript';
import { ServerError } from '../errors/ServerError';
import { database } from '../db/index';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseDao<T extends BaseModel<T>> {
  public modelRepo: Repository<T>;
  constructor(model: T) {
    this.modelRepo = database.getRepository(model.constructor as new () => T);
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  public async get(id: string): Promise<any> {
    return this.modelRepo.findOne({ where: { id } });
  }

  public async getAll(): Promise<any> {
    return this.modelRepo.findAll();
  }

  public async create(entry: T): Promise<any> {
    return this.modelRepo.create(entry as any);
  }

  public async update(id: string, entry: any): Promise<any> {
    return this.modelRepo.update(entry, { where: { id } });
  }
}
