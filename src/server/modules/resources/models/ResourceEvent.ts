import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResourceCalendar } from './ResourceCalendar';

@provide()
@Entity()
export class ResourceEvent extends BaseModel<ResourceEvent> {
  constructor() {
    super();
  }

  static getInstance(): ResourceEvent {
    return container.get(ResourceEvent);
  }

  @Property()
  title: string;

  @Property({ columnType: 'date' })
  dateFrom: Date;

  @Property({ columnType: 'date' })
  dateTo: Date;

  @ManyToOne({ entity: () => ResourceCalendar, onDelete: 'set null' })
  resourceCalendar: ResourceCalendar;
}
