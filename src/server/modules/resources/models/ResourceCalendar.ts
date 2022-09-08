import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from './Resource';
import { ResourceEvent } from './ResourceEvent';

@provide()
@Entity()
export class ResourceCalendar extends BaseModel<ResourceCalendar> {
  constructor() {
    super();
  }

  static getInstance(): ResourceCalendar {
    return container.get(ResourceCalendar);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @ManyToOne({ entity: () => Resource, onDelete: 'set null', nullable: true })
  resource?: Resource;

  @Property({ columnType: 'float8', nullable: true })
  hoursPerDay?: number;

  @Property({ nullable: true })
  timezone?: string;

  @Property({ nullable: true })
  twoWeeksCalendar?: boolean;

  @OneToMany({
    entity: () => ResourceEvent,
    mappedBy: (entity) => entity.resourceCalendar,
    lazy: true,
    eager: false,
  })
  resourceCalendar: ResourceEvent;
}
