import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';

export enum DateUnit {
  YEARS = 'Year',
  MOUNTHS = 'Mounth',
  DAYS = 'Day',
  HOURS = 'Hour',
  MINUTES = 'Minute',
}

@provide()
@Entity()
export class OrganizationSettings extends BaseModel<OrganizationSettings> {
  constructor() {
    super();
  }

  static getInstance(): OrganizationSettings {
    return container.get(OrganizationSettings);
  }

  @PrimaryKey()
  id?: number;

  //Reservation Settings
  @Property({ nullable: true })
  approversCanEditReservations: boolean;
  @Property({ nullable: true })
  requireReasonWhenEditingReservation: boolean;
  @Property({ nullable: true })
  hideOrganizationCalendar: boolean;
  @Property({ nullable: true })
  hideAccountNumberWhenMakingReservation: boolean;
  @Property({ nullable: true })
  showResourceImagesInReservation: boolean;
  @Property({ nullable: true })
  confirmationEmailWhenMakingReservation: string;
  @Property({ nullable: true })
  attachedIcsCalendarFeeds: boolean;
  @Property({ nullable: true })
  emailAddressToReceiveReservationReplyMessages: string[];

  //Invoices Settings
  @Property({ nullable: true })
  membersCanEditBillingAddress: boolean;
  @Property({ nullable: true })
  defaultInvoiceDueDateUnit: DateUnit;
  @Property({ nullable: true })
  defaultInvoiceDueDate: number;
  @Property({ nullable: true })
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal: boolean;
  @Property({ nullable: true })
  lockInvoicedReservationsAndRequests: boolean;

  //Access Settings
  @Property({ nullable: true })
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules: boolean;
  @Property({ nullable: true })
  memberShouldAccessByJoinCode: boolean;
  @Property({ nullable: true })
  joinCode: '';
  @Property({ nullable: true })
  yourOrganizationWillNeverAppearInSearchResults: boolean;
  @Property({ nullable: true })
  notifyAdministratorsWhenMembersJoinOrganization: boolean;
  @Property({ nullable: true })
  listResourceToNonMembers: boolean;
  @Property({ nullable: true })
  messageSentToNewMembers: string;
}
