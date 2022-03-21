import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class CountryGroup extends BaseModel<CountryGroup> {
  constructor() {
    super();
  }

  static getInstance(): CountryGroup {
    return container.get(CountryGroup);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;
}
