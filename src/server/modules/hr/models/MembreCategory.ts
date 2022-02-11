import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '@modules/base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class MembreCategory extends BaseModel<MembreCategory> {
  constructor() {
    super();
  }

  static getInstance(): MembreCategory {
    return container.get(MembreCategory);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'hr_membre_category_name_uniq' })
  @Property()
  name!: string;
}
