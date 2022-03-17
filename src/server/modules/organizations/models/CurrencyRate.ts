import { Entity, Index, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from './Organization';
import { Currency } from '@/modules/organizations/models/Currency';

@provideSingleton()
@Entity()
@Unique({ name: 'currency_rate_unique_name_per_day', properties: ['name', 'currency', 'organization'] })
export class CurrencyRate extends BaseModel<CurrencyRate> {
  constructor() {
    super();
  }

  static getInstance(): CurrencyRate {
    return container.get(CurrencyRate);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'currency_rate_name_index' })
  @Property({ columnType: 'date' })
  name!: Date;

  @Property({ columnType: 'numeric', nullable: true })
  rate?: number;

  @OneToOne({ entity: () => Currency, onDelete: 'cascade' })
  currency!: Currency;

  @OneToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;
}
