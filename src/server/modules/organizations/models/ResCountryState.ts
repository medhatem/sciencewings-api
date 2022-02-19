import { Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { ResCountry } from '../../organizations/models/ResCountry';
import { container, provideSingleton } from '@/di/index';

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
