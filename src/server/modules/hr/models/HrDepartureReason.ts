import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrDepartureReason extends BaseModel<HrDepartureReason> {
  constructor() {
    super();
  }

  static getInstance(): HrDepartureReason {
    return container.get(HrDepartureReason);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  sequence?: number;

  @Property()
  name!: string;
}
