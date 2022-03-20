import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Country } from '@/modules/organizations/models/Country';
import { CountryState } from '@/modules/organizations/models/CountryState';

@provide()
@Entity()
export class Bank extends BaseModel<Bank> {
  constructor() {
    super();
  }

  static getInstance(): Bank {
    return container.get(Bank);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  street?: string;

  @Property({ nullable: true })
  street2?: string;

  @Property({ nullable: true })
  zip?: string;

  @Property({ nullable: true })
  city?: string;

  @ManyToOne({ entity: () => CountryState, fieldName: 'state', onDelete: 'set null', nullable: true })
  state?: CountryState;

  @ManyToOne({ entity: () => Country, fieldName: 'country', onDelete: 'set null', nullable: true })
  country?: Country;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  active?: boolean;

  @Index({ name: 'bank_bic_index' })
  @Property({ nullable: true })
  bic?: string;
}
