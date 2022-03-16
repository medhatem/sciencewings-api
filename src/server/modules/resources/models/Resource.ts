import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { ResourceCalendar } from './ResourceCalendar';
import { Member } from '@/modules/hr';
import { ResourceTag } from './ResourceTag';

@provideSingleton()
@Entity()
export class Resource extends BaseModel<Resource> {
  constructor() {
    super();
  }

  static getInstance(): Resource {
    return container.get(Resource);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @ManyToOne({
    entity: () => Member,
    nullable: true,
  })
  public managers? = new Collection<Member>(this);

  @OneToMany({
    entity: () => ResourceTag,
    mappedBy: (entity) => entity.resource,
  })
  public tags? = new Collection<ResourceTag>(this);

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @Property()
  resourceType!: string;

  @OneToMany({ entity: () => ResourceCalendar, mappedBy: (entity) => entity.resource, nullable: true })
  calendar: ResourceCalendar;

  @Property()
  timezone!: string;
}
