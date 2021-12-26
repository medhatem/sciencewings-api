import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from '../../organisations/models/Organisation';
import { ResourceCalendar } from './ResourceCalendar';
import { ResourceResource } from './ResourceResource';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class ResourceCalendarLeaves extends BaseModel<ResourceCalendarLeaves> {
  constructor() {
    super();
  }

  static getInstance(): ResourceCalendarLeaves {
    return container.get(ResourceCalendarLeaves);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  name?: string;

  @ManyToOne({ entity: () => Organisation, onDelete: 'set null', nullable: true })
  organisation?: Organisation;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_calendar_leaves_calendar_id_index',
  })
  calendar?: ResourceCalendar;

  @Property({ columnType: 'timestamp', length: 6 })
  dateFrom!: Date;

  @Property({ columnType: 'timestamp', length: 6 })
  dateTo!: Date;

  @ManyToOne({
    entity: () => ResourceResource,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_calendar_leaves_resource_id_index',
  })
  resource?: ResourceResource;

  @Property({ nullable: true })
  timeType?: string;
}
