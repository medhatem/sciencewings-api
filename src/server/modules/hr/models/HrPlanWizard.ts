import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { HrEmployee } from './HrEmployee';
import { HrPlan } from './HrPlan';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrPlanWizard extends BaseModel<HrPlanWizard> {
  constructor() {
    super();
  }

  static getInstance(): HrPlanWizard {
    return container.get(HrPlanWizard);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => HrPlan, onDelete: 'set null', nullable: true })
  plan?: HrPlan;

  @ManyToOne({ entity: () => HrEmployee, onDelete: 'cascade' })
  employee!: HrEmployee;
}
