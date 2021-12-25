import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrPlan extends BaseModel<HrPlan> {
  constructor() {
    super();
  }

  static getInstance(): HrPlan {
    return container.get(HrPlan);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;
}
