import { Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';
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

  @PrimaryKey()
  @Property()
  name!: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
    primary: true,
  })
  organization: Organization;

  [PrimaryKeyType]?: [Organization, string];
}
