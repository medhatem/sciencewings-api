import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Calendar } from '@/modules/reservation/models/Calendar';
import { Infrastructure } from '@/modules/infrastructure';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { ResourceSettings } from '@/modules/resources/models//ResourceSettings';
import { ResourceStatus } from '@/modules/resources/models//ResourceStatus';
import { ResourceTag } from '@/modules/resources/models//ResourceTag';

@provide()
@Entity()
export class Resource extends BaseModel<Resource> {
  constructor() {
    super();
  }

  static getInstance(): Resource {
    return container.get(Resource);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToMany({ entity: () => Member, mappedBy: (entity) => entity.resources })
  managers = new Collection<Member>(this);

  @ManyToMany({
    entity: () => ResourceTag,
    mappedBy: (entity) => entity.resource,
    lazy: true,
    eager: false,
  })
  public tags? = new Collection<ResourceTag>(this);

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @Property()
  resourceType!: string;

  @Property()
  resourceClass!: string;

  @OneToMany({
    entity: () => Calendar,
    mappedBy: (entity) => entity.resource,
    nullable: true,
    lazy: true,
    eager: false,
  })
  calendar? = new Collection<Calendar>(this);

  @Property({ nullable: true })
  timezone?: string;

  @OneToOne({ entity: () => ResourceSettings, nullable: true, unique: false })
  settings?: ResourceSettings;

  @ManyToOne({ entity: () => Infrastructure, nullable: true, onDelete: 'cascade' })
  infrastructure?: Infrastructure;

  @OneToOne({ entity: () => ResourceStatus, nullable: true, unique: false })
  status?: ResourceStatus;
}
