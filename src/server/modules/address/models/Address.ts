import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';

export enum AddressType {
  USER = 'USER',
  ORGANIZATION = 'ORGANIZATION',
}

@provide()
@Entity()
export class Address extends BaseModel<Address> {
  constructor() {
    super();
  }
  static getInstance(): Address {
    return container.get(Address);
  }

  @PrimaryKey()
  id?: number;

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
}
