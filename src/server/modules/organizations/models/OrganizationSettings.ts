import { BooleanType, Entity, PrimaryKey, Property, StringType } from '@mikro-orm/core';
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
  @Property({ type: BooleanType })
  approversCanEditReservations: true;
  @Property({ type: BooleanType })
  requireReasonWhenEditingReservation: true;
  @Property({ type: BooleanType })
  hideOrganizationCalendar: true;
  @Property({ type: BooleanType })
  hideAccountNumberWhenMakingReservation: false;
  @Property({ type: BooleanType })
  showResourceImagesInReservation: true;
  @Property({ type: StringType })
  confirmationEmailWhenMakingReservation: '';
  @Property({ type: BooleanType })
  attachedIcsCalendarFeeds: true;
  @Property({ nullable: true })
  emailAddressToReceiveReservationReplyMessages: string[];

  //Invoices Settings
  @Property({ type: BooleanType })
  membersCanEditBillingAddress: false;
  @Property({ nullable: true })
  defaultInvoiceDueDateUnit: DateUnit;
  @Property({ nullable: true })
  defaultInvoiceDueDate: number;
  @Property({ type: BooleanType })
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal: true;
  @Property({ type: BooleanType })
  lockInvoicedReservationsAndRequests: true;

  //Access Settings
  @Property({ type: BooleanType })
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules: true;
  @Property({ type: BooleanType })
  memberShouldAccessByJoinCode: true;
  @Property({ type: StringType })
  joinCode: '';
  @Property({ type: BooleanType })
  yourOrganizationWillNeverAppearInSearchResults: false;
  @Property({ type: BooleanType })
  notifyAdministratorsWhenMembersJoinOrganization: true;
  @Property({ type: BooleanType })
  listResourceToNonMembers: true;
  @Property({ type: StringType })
  messageSentToNewMembers: '';
}
