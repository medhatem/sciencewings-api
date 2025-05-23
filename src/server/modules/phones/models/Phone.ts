import { Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { User } from '@/modules/users/models/User';

@provide()
@Entity()
export class Phone extends BaseModel<Phone> {
  constructor() {
    super();
  }

  static getInstance(): Phone {
    return container.get(Phone);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  phoneLabel: string;

  @Property()
  phoneCode: string;

  @Property()
  phoneNumber: string;

  @ManyToMany({ entity: () => User, nullable: true })
  user?: User;
}
