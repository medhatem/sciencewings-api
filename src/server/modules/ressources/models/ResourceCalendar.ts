import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from '../../organisations/models/Organisation';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class ResourceCalendar extends BaseModel<ResourceCalendar> {
  constructor() {
    super();
  }

  static getInstance(): ResourceCalendar {
    return container.get(ResourceCalendar);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Organisation, onDelete: 'set null', nullable: true })
  organisation?: Organisation;

  @Property({ columnType: 'float8', nullable: true })
  hoursPerDay?: number;

  @Property()
  tz!: string;

  @Property({ nullable: true })
  twoWeeksCalendar?: boolean;
}
