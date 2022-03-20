import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Currency } from '@/modules/organizations/models/Currency';

@provide()
@Entity()
export class Country extends BaseModel<Country> {
  constructor() {
    super();
  }

  static getInstance(): Country {
    return container.get(Country);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'res_country_name_uniq' })
  @Property()
  name!: string;

  @Unique({ name: 'res_country_code_uniq' })
  @Property({ length: 2, nullable: true })
  code?: string;

  @Property({ columnType: 'text', nullable: true })
  addressFormat?: string;

  @Property({ nullable: true })
  addressViewId?: number;

  @ManyToOne({ entity: () => Currency, onDelete: 'set null', nullable: true })
  currency?: Currency;

  @Property({ nullable: true })
  phoneCode?: number;

  @Property({ nullable: true })
  namePosition?: string;

  @Property({ nullable: true })
  vatLabel?: string;

  @Property({ nullable: true })
  stateRequired?: boolean;

  @Property({ nullable: true })
  zipRequired?: boolean;
}
