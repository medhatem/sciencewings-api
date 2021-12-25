import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ResCountry } from '../../organisations/models/ResCountry';
import { ResourceCalendar } from '../../ressources/models/ResourceCalendar';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrPayrollStructureType extends BaseModel<HrPayrollStructureType> {
  constructor() {
    super();
  }

  static getInstance(): HrPayrollStructureType {
    return container.get(HrPayrollStructureType);
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
