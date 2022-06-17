import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class OrganizationType extends BaseModel<OrganizationType> {
  constructor() {
    super();
  }

  static getInstance(): OrganizationType {
    return container.get(OrganizationType);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;
}
