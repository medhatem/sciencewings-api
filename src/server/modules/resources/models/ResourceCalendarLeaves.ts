import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Calendar } from '@/modules/reservation/models/Calendar';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from '@/modules/resources/models/Resource';

@provide()
@Entity()
export class ResourceCalendarLeaves extends BaseModel<ResourceCalendarLeaves> {
  constructor() {
    super();
  }

  static getInstance(): ResourceCalendarLeaves {
    return container.get(ResourceCalendarLeaves);
  }

  @PrimaryKey()
  id?: number;

  @Property({ nullable: true })
  name?: string;

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @ManyToOne({
    entity: () => Calendar,
    onDelete: 'set null',
    nullable: true,
    index: 'resource_calendar_leaves_calendar_id_index',
  })
  calendar?: Calendar;

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
