import { BaseModel } from '../model/BaseModel';
import { IBase } from '../interface';
import { ServerError } from '../errors/ServerError';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseDao<T extends IBase> {
  constructor(public model: BaseModel<T>) {
    model.generateModel();
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  public async get(id: string): Promise<T> {
    return this.model.modelClass.findById(id).exec();
  }

  public async create(entry: T): Promise<T> {
    return this.model.modelClass.create(entry);
  }
}
