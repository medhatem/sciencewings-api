import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organizations/models/Organization';
import { ResourceCalendar } from './ResourceCalendar';
import { Resource } from './Resource';

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

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organisation?: Organization;

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
    entity: () => Resource,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_calendar_leaves_resource_id_index',
  })
  resource?: Resource;

  @Property({ nullable: true })
  timeType?: string;
}
