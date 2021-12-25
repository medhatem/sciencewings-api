import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from './BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class DecimalPrecision extends BaseModel<DecimalPrecision> {
  constructor() {
    super();
  }

  static getInstance(): DecimalPrecision {
    return container.get(DecimalPrecision);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'decimal_precision_name_index' })
  @Unique({ name: 'decimal_precision_name_uniq' })
  @Property()
  name!: string;

  @Property()
  digits!: number;
}
