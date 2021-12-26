import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from '../../organisations/models/Organisation';
import { User } from '../../users/models/User';
import { ResourceCalendar } from './ResourceCalendar';
import { container, provideSingleton } from '@di/index';

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

  @ManyToOne({ entity: () => Organisation, onDelete: 'set null', nullable: true })
  organisation?: Organisation;

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
