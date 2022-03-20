import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';

@provide()
@Entity()
export class WorkLocation extends BaseModel<WorkLocation> {
  constructor() {
    super();
  }

  static getInstance(): WorkLocation {
    return container.get(WorkLocation);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  active?: boolean;

  @Property()
  name!: string;

  @ManyToOne({ entity: () => Organization })
  organization!: Organization;
}
