import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organizations/models/Organization';
import { ResPartner } from '../../organizations/models/ResPartner';

@provideSingleton()
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

  @ManyToOne({ entity: () => ResPartner })
  address!: ResPartner;

  @Property({ nullable: true })
  locationNumber?: string;
}
