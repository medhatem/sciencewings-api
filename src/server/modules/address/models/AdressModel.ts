import { Organization } from '../../organizations/models/Organization';
import { BaseModel } from '../../base/models/BaseModel';
import { Property, Entity, ManyToOne } from '@mikro-orm/core';

import { provideSingleton, container } from '@di/index';

export enum AddressType {
  USER = 'USER',
  ORGANIZATION = 'ORGANIZATION',
}

@provideSingleton()
@Entity()
export class Address extends BaseModel<Address> {
  static getInstance(): void {
    container.get(Address);
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

  @Property()
  appartement: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
  })
  organization: Organization;
}
