import { Entity, Index, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from './Organization';
import { ResCurrency } from './ResCurrency';

@provideSingleton()
@Entity()
@Unique({ name: 'res_currency_rate_unique_name_per_day', properties: ['name', 'currency', 'organization'] })
export class ResCurrencyRate extends BaseModel<ResCurrencyRate> {
  constructor() {
    super();
  }

  static getInstance(): ResCurrencyRate {
    return container.get(ResCurrencyRate);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'res_currency_rate_name_index' })
  @Property({ columnType: 'date' })
  name!: Date;

  @Property({ columnType: 'numeric', nullable: true })
  rate?: number;

  @OneToOne({ entity: () => ResCurrency, onDelete: 'cascade' })
  currency!: ResCurrency;

  @OneToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;
}
