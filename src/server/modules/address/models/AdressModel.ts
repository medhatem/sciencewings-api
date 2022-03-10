import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr';
import { Organization } from '@/modules/organizations/models/Organization';
import { User } from '@/modules/users';

export enum AddressType {
  USER = 'USER',
  ORGANIZATION = 'ORGANIZATION',
}

@provide()
@Entity()
export class Address extends BaseModel<Address> {
  static getInstance(): Address {
    return container.get(Address);
  }

  @Property()
  country: string;

  @Property()
  province: string;

  @Property()
  code: string;

  @Property()
  type: AddressType;

  @Property()
  city: string;

  @Property()
  street: string;

  @Property({ nullable: true })
  apartment?: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
  })
  organization?: Organization;

  @ManyToOne({ entity: () => User, onDelete: 'cascade', nullable: true })
  user?: User;

  @ManyToOne({ entity: () => User, onDelete: 'cascade', nullable: true })
  member?: Member;
}
