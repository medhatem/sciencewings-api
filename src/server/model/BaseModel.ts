import * as mongoose from 'mongoose';

import { IBase } from '../interface';
import { getModelForClass } from '@typegoose/typegoose';

export abstract class BaseModel<T extends IBase> {
  public modelClass: mongoose.Model<T>;
  constructor() {}

  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  /**
   * creates the model of a certain name based off of a given schema
   */
  public generateModel(name?: string): mongoose.Model<T> {
    return (this.modelClass = getModelForClass(this.constructor as any, {
      options: { customName: name },
      schemaOptions: { timestamps: true },
    }));
  }
}
