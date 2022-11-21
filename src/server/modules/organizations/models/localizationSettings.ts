import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class localisationSettings extends BaseModel<localisationSettings> {
  constructor() {
    super();
  }

  static getInstance(): localisationSettings {
    return container.get(localisationSettings);
  }

  @PrimaryKey()
  id?: number;

  //organization location Settings
  @Property({ nullable: true })
  apartement: string;

  @Property()
  street: string;

  @Property()
  city: string;

  @Property()
  country: string;

  @Property()
  region: string;

  @Property()
  zipCode: string;
}
