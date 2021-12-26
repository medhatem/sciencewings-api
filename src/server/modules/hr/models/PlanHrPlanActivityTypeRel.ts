import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Plan } from './Plan';
import { PlanActivityType } from './PlanActivityType';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({
  name: 'hr_plan_hr_plan_activity_type_hr_plan_activity_type_id_hr_p_idx',
  properties: ['hrPlan', 'hrPlanActivityType'],
})
export class PlanHrPlanActivityTypeRel {
  @ManyToOne({ entity: () => Plan, onDelete: 'cascade', primary: true })
  hrPlan!: Plan;

  @ManyToOne({ entity: () => PlanActivityType, onDelete: 'cascade', primary: true })
  hrPlanActivityType!: PlanActivityType;
}
