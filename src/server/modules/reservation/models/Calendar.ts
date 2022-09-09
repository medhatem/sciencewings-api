import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Reservation } from './Reservation';
import { Resource } from '@/modules/resources/models/Resource';

@provide()
@Entity()
export class Calendar extends BaseModel<Calendar> {
  constructor() {
    super();
  }

  static getInstance(): Calendar {
    return container.get(Calendar);
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
    entity: () => Reservation,
    mappedBy: (entity) => entity.resourceCalendar,
    lazy: true,
    eager: false,
  })
  resourceCalendar: Reservation;
}
