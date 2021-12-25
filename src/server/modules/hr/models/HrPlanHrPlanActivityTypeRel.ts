import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { HrPlan } from './HrPlan';
import { HrPlanActivityType } from './HrPlanActivityType';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({
  name: 'hr_plan_hr_plan_activity_type_hr_plan_activity_type_id_hr_p_idx',
  properties: ['hrPlan', 'hrPlanActivityType'],
})
export class HrPlanHrPlanActivityTypeRel {
  @ManyToOne({ entity: () => HrPlan, onDelete: 'cascade', primary: true })
  hrPlan!: HrPlan;

  @ManyToOne({ entity: () => HrPlanActivityType, onDelete: 'cascade', primary: true })
  hrPlanActivityType!: HrPlanActivityType;
}
