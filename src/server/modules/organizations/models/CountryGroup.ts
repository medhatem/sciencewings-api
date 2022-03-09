import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class CountryGroup extends BaseModel<CountryGroup> {
  constructor() {
    super();
  }

  static getInstance(): CountryGroup {
    return container.get(CountryGroup);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
}
