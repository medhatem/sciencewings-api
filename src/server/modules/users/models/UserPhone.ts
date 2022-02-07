import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { User } from './User';

// import { ResPartner } from '../../organisations/models/ResPartner';

@provideSingleton()
@Entity()
export class UserPhone extends BaseModel<UserPhone> {
  constructor() {
    super();
  }

  static getInstance(): UserPhone {
    return container.get(UserPhone);
  }
  @Property()
  label: string;

  @Property()
  code: string;

  @Property()
  number: string;

  @ManyToOne({ entity: () => User })
  user: User;
}
