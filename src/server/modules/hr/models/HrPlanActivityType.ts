import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { User } from '../../users/models/User';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrPlanActivityType extends BaseModel<HrPlanActivityType> {
  constructor() {
    super();
  }

  static getInstance(): HrPlanActivityType {
    return container.get(HrPlanActivityType);
  }
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  activityTypeId?: number;

  @Property({ nullable: true })
  summary?: string;

  @ManyToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  responsible?: User;

  @Property({ columnType: 'text', nullable: true })
  note?: string;
}
