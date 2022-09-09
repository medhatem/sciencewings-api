import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Calendar } from './Calendar';

@provide()
@Entity()
export class Reservation extends BaseModel<Reservation> {
  constructor() {
    super();
  }

  static getInstance(): Reservation {
    return container.get(Reservation);
  }

  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property({ columnType: 'timestamp' })
  dateFrom: Date;

  @Property({ columnType: 'timestamp' })
  dateTo: Date;

  @ManyToOne({ entity: () => Calendar, onDelete: 'set null' })
  resourceCalendar: Calendar;
}
