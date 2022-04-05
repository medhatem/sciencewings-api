import {
  BooleanType,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  StringType,
} from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr';
import { Organization } from '@/modules/organizations/models/Organization';
import { ResourceCalendar } from './ResourceCalendar';
import { ResourceTag } from './ResourceTag';

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

  @Property()
  description!: string;

  @ManyToMany({
    entity: () => Member,
    nullable: true,
    mappedBy: (entity) => entity.resources,
  })
  public managers? = new Collection<Member>(this);

  @ManyToMany({
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

  @Property()
  resourceClass!: string;

  @OneToMany({ entity: () => ResourceCalendar, mappedBy: (entity) => entity.resource, nullable: true })
  calendar: ResourceCalendar;

  @Property()
  timezone!: string;

  //Resource settings
  // General
  // general
  // status
  @Property({ type: StringType })
  statusType = '';
  @Property({ type: StringType })
  statusDescription = '';
  // visibility
  @Property({ type: BooleanType })
  visibility = true;
  @Property({ type: BooleanType })
  isUnlistedOnSitePage = false;
  @Property({ type: BooleanType })
  isUnlistedToUsersWhoCannotReserve = true;
  @Property({ type: BooleanType })
  isFullyHiddentoUsersWhoCannotReserve = true;
  @Property({ type: BooleanType })
  isPromotedOnSitePageAsALargeButtonAboveOtherResources = false;
  @Property({ type: BooleanType })
  isHideAvailabilityonSitePage = false;
  // Properties
  @Property({ type: StringType })
  accessToResource = '';
}
