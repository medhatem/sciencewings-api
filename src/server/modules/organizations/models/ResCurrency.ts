import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '@modules/base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class ResCurrency extends BaseModel<ResCurrency> {
  constructor() {
    super();
  }

  static getInstance(): ResCurrency {
    return container.get(ResCurrency);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'res_currency_unique_name' })
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
