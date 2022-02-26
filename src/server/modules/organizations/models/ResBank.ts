import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCountry } from '@/modules/organizations/models/ResCountry';
import { ResCountryState } from '@/modules/organizations/models/ResCountryState';

@provideSingleton()
@Entity()
export class ResBank extends BaseModel<ResBank> {
  constructor() {
    super();
  }

  static getInstance(): ResBank {
    return container.get(ResBank);
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

  @ManyToOne({ entity: () => ResCountryState, fieldName: 'state', onDelete: 'set null', nullable: true })
  state?: ResCountryState;

  @ManyToOne({ entity: () => ResCountry, fieldName: 'country', onDelete: 'set null', nullable: true })
  country?: ResCountry;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  active?: boolean;

  @Index({ name: 'res_bank_bic_index' })
  @Property({ nullable: true })
  bic?: string;
}
