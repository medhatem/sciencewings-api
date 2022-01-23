import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organisations/models/Organization';

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

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organisation?: Organization;

  @Property({ columnType: 'float8', nullable: true })
  hoursPerDay?: number;

  @Property()
  tz!: string;

  @Property({ nullable: true })
  twoWeeksCalendar?: boolean;
}
