import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCountry } from '@/modules/organizations/models/ResCountry';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';

@provideSingleton()
@Entity()
export class PayrollStructureType extends BaseModel<PayrollStructureType> {
  constructor() {
    super();
  }

  static getInstance(): PayrollStructureType {
    return container.get(PayrollStructureType);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  name?: string;

  @ManyToOne({ entity: () => ResourceCalendar, onDelete: 'set null', nullable: true })
  defaultResourceCalendar?: ResourceCalendar;

  @ManyToOne({ entity: () => ResCountry, onDelete: 'set null', nullable: true })
  country?: ResCountry;
}
