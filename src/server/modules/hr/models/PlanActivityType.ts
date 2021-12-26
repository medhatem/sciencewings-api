import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { User } from '../../users/models/User';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class PlanActivityType extends BaseModel<PlanActivityType> {
  constructor() {
    super();
  }

  static getInstance(): PlanActivityType {
    return container.get(PlanActivityType);
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
