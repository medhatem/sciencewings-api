import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class Permission extends BaseModel<Permission> {
  constructor() {
    super();
  }

  static getInstance(): Permission {
    return container.get(Permission);
  }

  @PrimaryKey()
  id?: number;

  @Property({ unique: true })
  name!: string;

  @Property()
  module!: string;

  @Property()
  operationDB!: string;
}
