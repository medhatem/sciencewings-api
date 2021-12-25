import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { HrDepartureReason } from './HrDepartureReason';
import { HrEmployee } from './HrEmployee';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrDepartureWizard extends BaseModel<HrDepartureWizard> {
  constructor() {
    super();
  }

  static getInstance(): HrDepartureWizard {
    return container.get(HrDepartureWizard);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => HrDepartureReason, onDelete: 'cascade' })
  departureReason!: HrDepartureReason;

  @Property({ columnType: 'text', nullable: true })
  departureDescription?: string;

  @Property({ columnType: 'date' })
  departureDate!: Date;

  @ManyToOne({ entity: () => HrEmployee, onDelete: 'cascade' })
  employee!: HrEmployee;

  @Property({ nullable: true })
  archivePrivateAddress?: boolean;

  @Property({ nullable: true })
  setDateEnd?: boolean;
}
