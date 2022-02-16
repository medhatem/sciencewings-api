import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCurrency } from '@/modules/organizations/models/ResCurrency';

@provideSingleton()
@Entity()
export class ResCountry extends BaseModel<ResCountry> {
  constructor() {
    super();
  }

  static getInstance(): ResCountry {
    return container.get(ResCountry);
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

  @ManyToOne({ entity: () => ResCurrency, onDelete: 'set null', nullable: true })
  currency?: ResCurrency;

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
