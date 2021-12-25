import { Entity, Index, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from './Organisation';
import { ResCurrency } from '../../organisations/models/ResCurrency';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Unique({ name: 'res_currency_rate_unique_name_per_day', properties: ['name', 'currency', 'company'] })
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

  @OneToOne({ entity: () => Organisation, onDelete: 'set null', nullable: true })
  company?: Organisation;
}
