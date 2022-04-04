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

  @OneToMany({ entity: () => ResourceCalendar, mappedBy: (entity) => entity.resource, nullable: true })
  calendar: ResourceCalendar;

  @Property()
  timezone!: string;

  //Resource settings
  //general
  @Property({ type: BooleanType })
  isEnabled = true;
  @Property({ type: BooleanType })
  isLoanable = false;
  @Property({ type: BooleanType })
  isReturnTheirOwnLoans = false;
  @Property({ type: BooleanType })
  isReservingLoansAtFutureDates = false;
  @Property({ type: StringType })
  fixedLoanDuration = '0 days';
  @Property({ type: StringType })
  overdueNoticeDelay = '0 days';
  @Property({ type: StringType })
  recurringReservations = '0 days';

  //Unit
  @Property({ type: StringType })
  unitName = '';
  @Property({ type: Number })
  unitLimit = 0;
  @Property({ type: Number })
  unites = 0;

  // Time restriction
  @Property({ type: BooleanType })
  isEditingWindowForUsers = false;
  @Property({ type: BooleanType })
  isRestrictCreatingNewReservationBeforeTime = false;
  @Property({ type: BooleanType })
  isRestrictCreatingNewReservationAfterTime = false;
  @Property({ type: StringType })
  reservationTimeGranularity = '';
  @Property({ type: BooleanType })
  isAllowUsersToEndReservationEarly = false;
  @Property({ type: StringType })
  defaultReservationDuration = '';
  @Property({ type: StringType })
  reservationDurationMinimum = '';
  @Property({ type: StringType })
  reservationDurationMaximum = '';
  @Property({ type: StringType })
  bufferTimeBeforeReservation = '';

  // Group

  // visibility
  @Property({ type: StringType })
  isReservationDetailsVisibilityToNonModerators = '';
}
