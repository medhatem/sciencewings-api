import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Employee } from './Employee';
import { Plan } from './Plan';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class PlanWizard extends BaseModel<PlanWizard> {
  constructor() {
    super();
  }

  static getInstance(): PlanWizard {
    return container.get(PlanWizard);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Plan, onDelete: 'set null', nullable: true })
  plan?: Plan;

  @ManyToOne({ entity: () => Employee, onDelete: 'cascade' })
  employee!: Employee;
}
