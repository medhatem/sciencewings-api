import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provide } from '@di/index';
import { BaseModel } from '@modules/base/models/BaseModel';
import { Organization } from '@modules/organisations/models/Organization';

@provide()
@Entity()
export class OrganizationContact extends BaseModel<OrganizationContact> {
  constructor() {
    super();
  }

  static getInstance(): OrganizationContact {
    return container.get(OrganizationContact);
  }

  @Property()
  type!: string;

  @Property()
  value!: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
  })
  organisation: Organization;
}
