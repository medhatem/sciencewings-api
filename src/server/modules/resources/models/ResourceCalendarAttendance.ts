import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Resource } from './Resource';
import { ResourceCalendar } from './ResourceCalendar';

@provide()
@Entity()
export class ResourceCalendarAttendance extends BaseModel<ResourceCalendarAttendance> {
  constructor() {
    super();
  }

  static getInstance(): ResourceCalendarAttendance {
    return container.get(ResourceCalendarAttendance);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Index({ name: 'resource_calendar_attendance_dayofweek_index' })
  @Property()
  dayofweek!: string;

  @Property({ columnType: 'date', nullable: true })
  dateFrom?: Date;

  @Property({ columnType: 'date', nullable: true })
  dateTo?: Date;

  @Index({ name: 'resource_calendar_attendance_hour_from_index' })
  @Property({ columnType: 'float8' })
  hourFrom!: number;

  @Property({ columnType: 'float8' })
  hourTo!: number;

  @ManyToOne({ entity: () => ResourceCalendar, onDelete: 'cascade' })
  calendar!: ResourceCalendar;

  @Property()
  dayPeriod!: string;

  @ManyToOne({ entity: () => Resource, onDelete: 'set null', nullable: true })
  resource?: Resource;

  @Property({ nullable: true })
  weekType?: string;

  @Property({ nullable: true })
  displayType?: string;

  @Property({ nullable: true })
  sequence?: number;
}
