import { Column, ForeignKey, Table } from 'sequelize-typescript';

import { BaseModel } from './BaseModel';
import { User } from './User';

@Table({
  timestamps: true,
})
export class Address extends BaseModel<Address> {
  @Column
  zip: string;

  @Column
  city: string;

  @Column
  street: string;

  @Column
  appt?: string;

  @ForeignKey(() => User)
  userId: number;
}
