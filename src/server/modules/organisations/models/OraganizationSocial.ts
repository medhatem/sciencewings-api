import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provide } from '@di/index';
import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '@modules/organisations/models/Organization';

@provide()
@Entity()
export class OrganizationSocial extends BaseModel<OrganizationSocial> {
  constructor() {
    super();
  }

  static getInstance(): OrganizationSocial {
    return container.get(OrganizationSocial);
  }

  @Property()
  type!: string; // facebook - linkedin ...

  @Property()
  link!: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    nullable: true,
  })
  organisation: Organization;
}
