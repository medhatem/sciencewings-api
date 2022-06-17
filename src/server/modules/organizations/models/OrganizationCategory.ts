import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class OrganizationCategory extends BaseModel<OrganizationCategory> {
  constructor() {
    super();
  }

  static getInstance(): OrganizationCategory {
    return container.get(OrganizationCategory);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;
}
