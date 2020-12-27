import * as mongoose from 'mongoose';

import { IBase } from '../interface';

const { Schema } = mongoose;

export abstract class BaseModel<T extends IBase> {
  public schema: mongoose.Schema<T>;
  public modelClass: mongoose.Model<T>;
  constructor() {}

  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  /**
   * describes all the properties that a given schema/model needs to have
   */
  public abstract initProperties(): mongoose.Schema<T>;

  /**
   * creates the model of a certain name based off of a given schema
   */
  public generateModel(name?: string): mongoose.Model<T> {
    return (this.modelClass = mongoose.model<T>(name || this.constructor.name, this.initSchema()));
  }

  /**
   * initializes the model schema by adding all the needed properties and appending createdAt and updatedAt properties
   * that are common for all models
   *
   *
   */
  public initSchema(): mongoose.Schema {
    return (this.schema = new Schema(this.initProperties(), {
      timestamps: true /** adds createdAt and updatedAt flags */,
    }));
  }

  // istanbul ignore next
  public setSchema(schema: mongoose.Schema): void {
    this.schema = schema;
  }

  // istanbul ignore next
  public getSchema(): mongoose.Schema {
    return this.schema;
  }
}
