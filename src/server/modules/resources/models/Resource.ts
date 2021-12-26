import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from '../../organisations/models/Organisation';
import { ResourceCalendar } from './ResourceCalendar';
import { ResourceResource } from './ResourceResource';
import { container, provideSingleton } from '@di/index';

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
    entity: () => Organisation,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_test_organisation_id_index',
  })
  organisation?: Organisation;

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
