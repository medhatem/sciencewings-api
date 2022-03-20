import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class Currency extends BaseModel<Currency> {
  constructor() {
    super();
  }

  static getInstance(): Currency {
    return container.get(Currency);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'currency_unique_name' })
  @Property()
  name!: string;

  @Property()
  symbol!: string;

  @Property({ nullable: true })
  fullName?: string;

  @Property({ columnType: 'numeric', nullable: true })
  rounding?: number;

  @Property({ nullable: true })
  decimalPlaces?: number;

  @Property({ nullable: true })
  active?: boolean;

  @Property({ nullable: true })
  position?: string;

  @Property({ nullable: true })
  currencyUnitLabel?: string;

  @Property({ nullable: true })
  currencySubunitLabel?: string;
}
