import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';

@provide()
@Entity()
export class OrganizationLabel extends BaseModel<OrganizationLabel> {
  constructor() {
    super();
  }

  static getInstance(): OrganizationLabel {
    return container.get(OrganizationLabel);
  }

  @Unique()
  @Property()
  name!: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
  })
  organization: Organization;
}
