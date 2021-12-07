import { Model, Table } from 'sequelize-typescript';

@Table
export class BaseModel<T> extends Model<T> {
  // constructor() {
  //   super();
  // }

  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }
}
