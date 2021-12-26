import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class DepartureReason extends BaseModel<DepartureReason> {
  constructor() {
    super();
  }

  static getInstance(): DepartureReason {
    return container.get(DepartureReason);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  sequence?: number;

  @Property()
  name!: string;
}
