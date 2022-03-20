import { Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Country } from '@/modules/organizations/models/Country';

@provide()
@Entity()
@Unique({ name: 'country_state_name_code_uniq', properties: ['country', 'code'] })
export class CountryState extends BaseModel<CountryState> {
  constructor() {
    super();
  }

  static getInstance(): CountryState {
    return container.get(CountryState);
  }

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Country })
  country!: Country;

  @Property()
  name!: string;

  @Property()
  code!: string;
}
