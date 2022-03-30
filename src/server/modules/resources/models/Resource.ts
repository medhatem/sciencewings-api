import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
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
  @Property({ nullable: true })
  isEnabled: boolean;
  @Property({ nullable: true })
  isLoanable: boolean;
  @Property({ nullable: true })
  isReturnTheirOwnLoans: boolean;
  @Property({ nullable: true })
  isReservingLoansAtFutureDates: boolean;
  @Property({ nullable: true })
  fixedLoanDuration: string;
  @Property({ nullable: true })
  overdueNoticeDelay: string;
  @Property({ nullable: true })
  recurringReservations: string;

  //Unit
  @Property({ nullable: true })
  unitName: string;
  @Property({ nullable: true })
  unitLimit: string;
  @Property({ nullable: true })
  unites: number;

  // Time restriction
  @Property({ nullable: true })
  isEditingWindowForUsers: boolean;
  @Property({ nullable: true })
  isRestrictCreatingNewReservationBeforeTime: boolean;
  @Property({ nullable: true })
  isRestrictCreatingNewReservationAfterTime: boolean;
  @Property({ nullable: true })
  reservationTimeGranularity: string;
  @Property({ nullable: true })
  isAllowUsersToEndReservationEarly: boolean;
  @Property({ nullable: true })
  defaultReservationDuration: string;
  @Property({ nullable: true })
  reservationDurationMinimum: string;
  @Property({ nullable: true })
  reservationDurationMaximum: string;
  @Property({ nullable: true })
  bufferTimeBeforeReservation: string;
}
