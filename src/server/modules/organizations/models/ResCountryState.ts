import { Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCountry } from '@/modules/organizations/models/ResCountry';

@provideSingleton()
@Entity()
@Unique({ name: 'res_country_state_name_code_uniq', properties: ['country', 'code'] })
export class ResCountryState extends BaseModel<ResCountryState> {
  constructor() {
    super();
  }

  static getInstance(): ResCountryState {
    return container.get(ResCountryState);
  }

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => ResCountry })
  country!: ResCountry;

  @Property()
  name!: string;

  @Property()
  code!: string;
}
