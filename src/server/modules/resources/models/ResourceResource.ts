import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organisations/models/Organization';
import { ResourceCalendar } from './ResourceCalendar';
import { User } from '../../users/models/User';

@provideSingleton()
@Entity()
export class ResourceResource extends BaseModel<ResourceResource> {
  constructor() {
    super();
  }

  static getInstance(): ResourceResource {
    return container.get(ResourceResource);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @Property()
  resourceType!: string;

  @ManyToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  user?: User;

  @Property({ columnType: 'float8' })
  timeEfficiency!: number;

  @ManyToOne({ entity: () => ResourceCalendar })
  calendar!: ResourceCalendar;

  @Property()
  tz!: string;
}
