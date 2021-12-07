import { Column, HasMany, Index, Table } from 'sequelize-typescript';
import { container, provideSingleton } from '@di/index';

import { Address } from './Address';
import { BaseModel } from './BaseModel';

@provideSingleton()
@Table({
  timestamps: true,
})
export class User extends BaseModel<User> {
  // constructor() {
  //   super();
  // }

  static getInstance(): User {
    return container.get(User);
  }

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({
    unique: true,
  })
  @Index
  email: string;

  @Column
  password: string;

  @HasMany(() => Address)
  addresses: Address[];
}
