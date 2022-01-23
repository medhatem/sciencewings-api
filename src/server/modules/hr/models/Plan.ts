import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class Plan extends BaseModel<Plan> {
  constructor() {
    super();
  }

  static getInstance(): Plan {
    return container.get(Plan);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;
}
