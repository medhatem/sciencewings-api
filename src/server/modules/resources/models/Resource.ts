import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organisations/models/Organization';
import { ResourceCalendar } from './ResourceCalendar';
import { ResourceResource } from './ResourceResource';

@provideSingleton()
@Entity()
export class Resource extends BaseModel<Resource> {
  constructor() {
    super();
  }

  static getInstance(): Resource {
    return container.get(Resource);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => ResourceResource, index: 'resource_test_resource_id_index' })
  resource!: ResourceResource;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_test_organization_id_index',
  })
  organization?: Organization;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_test_resource_calendar_id_index',
  })
  resourceCalendar?: ResourceCalendar;

  @Property({ nullable: true })
  name?: string;
}
