import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@/di/index';

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
