import { Collection, Entity, Index, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { Address } from './Address';
import { BaseModel } from './BaseModel';

@provideSingleton()
@Entity()
export class User extends BaseModel<User> {
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }
  @PrimaryKey()
  @Index()
  id!: number;

  @Property({ name: 'firstname' })
  firstName: string;

  @Property({ name: 'lastname' })
  lastName: string;

  @Property({
    unique: true,
  })
  @Index()
  email: string;

  @Property()
  password: string;

  @OneToMany(() => Address, (address) => address.userId)
  addresses? = new Collection<Address>(this);
}
