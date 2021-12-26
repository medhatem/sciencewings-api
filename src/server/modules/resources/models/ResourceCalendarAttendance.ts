import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { ResourceCalendar } from './ResourceCalendar';
import { ResourceResource } from './ResourceResource';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
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

  @ManyToOne({ entity: () => ResourceResource, onDelete: 'set null', nullable: true })
  resource?: ResourceResource;

  @Property({ nullable: true })
  weekType?: string;

  @Property({ nullable: true })
  displayType?: string;

  @Property({ nullable: true })
  sequence?: number;
}
