import * as mongoose from 'mongoose';

import { BaseModel } from '@models/BaseModel';
import { DocumentType } from '@typegoose/typegoose';
import { ServerError } from '../errors/ServerError';
import { provideSingleton } from '../di';

@provideSingleton()
export class BaseDao<T extends BaseModel<T>> {
  constructor(public model: T) {
    model.generateModel();
  }

  static getInstance(): void {
    throw new ServerError('baseModel must be overriden');
  }

  public async get(id: string): Promise<DocumentType<T>> {
    return this.model.modelClass.findById(id).exec();
  }

  public async getAll(): Promise<DocumentType<T>[]> {
    return this.model.modelClass.find().exec();
  }

  public async create(entry: T): Promise<DocumentType<T>> {
    return this.model.modelClass.create(entry as any);
  }

  public async update(id: string, entry: any): Promise<DocumentType<T>> {
    return this.model.modelClass.updateOne({ _id: mongoose.Types.ObjectId(id) } as any, entry);
  }
}
