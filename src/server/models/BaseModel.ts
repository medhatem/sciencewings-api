import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

export declare type AnyParamConstructor<T> = new (...args: any) => T;

export abstract class BaseModel<T> {
  public modelClass: ReturnModelType<AnyParamConstructor<T>, Record<string, any>>;

  constructor() {}

  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  /**
   * creates the model of a certain name based off of a given schema
   */
  public generateModel(name?: string): T {
    return (this.modelClass = getModelForClass(this.constructor as any, {
      options: { customName: name },
      schemaOptions: { timestamps: true },
    }));
  }
}
