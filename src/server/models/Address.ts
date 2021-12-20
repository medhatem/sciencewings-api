import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { BaseModel } from './BaseModel';
import { User } from './User';

@Entity()
export class Address extends BaseModel<Address> {
  @PrimaryKey()
  @Index()
  id!: number;

  @Property()
  zip: string;

  @Property()
  city: string;

  @Property()
  street: string;

  @Property()
  appt?: string;

  @ManyToOne({ entity: () => User })
  userId: number;
}
