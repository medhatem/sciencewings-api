import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provide } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organizations/models/Organization';

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

  generateNewInstance(): Address {
    return Address.getInstance();
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
  apartment: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
  })
  organization: Organization;
}
