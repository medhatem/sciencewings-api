import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { DepartureReason } from './DepartureReason';
import { Employee } from './Employee';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class DepartureWizard extends BaseModel<DepartureWizard> {
  constructor() {
    super();
  }

  static getInstance(): DepartureWizard {
    return container.get(DepartureWizard);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => DepartureReason, onDelete: 'cascade' })
  departureReason!: DepartureReason;

  @Property({ columnType: 'text', nullable: true })
  departureDescription?: string;

  @Property({ columnType: 'date' })
  departureDate!: Date;

  @ManyToOne({ entity: () => Employee, onDelete: 'cascade' })
  employee!: Employee;

  @Property({ nullable: true })
  archivePrivateAddress?: boolean;

  @Property({ nullable: true })
  setDateEnd?: boolean;
}
