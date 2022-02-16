import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class ResCountryGroup extends BaseModel<ResCountryGroup> {
  constructor() {
    super();
  }

  static getInstance(): ResCountryGroup {
    return container.get(ResCountryGroup);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
}
