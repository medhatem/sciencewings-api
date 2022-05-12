import { BooleanType, DateType, Entity, PrimaryKey, Property, StringType } from '@mikro-orm/core';
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

  //Member Settings
  @Property({ nullable: true, type: BooleanType })
  membersCanEditAccountNumbers = true;
  @Property({ nullable: true, type: BooleanType })
  promptForAccouantNumbers = true;
  @Property({ nullable: true, type: StringType })
  acountNumberNote = '';
  @Property({ nullable: true, type: BooleanType })
  allowMembersToSeeAllOtherMembers = true;

  //Reservation Settings
  @Property({ nullable: true, type: BooleanType })
  approversCanEditReservations = true;
  @Property({ nullable: true, type: BooleanType })
  requireReasonWhenEditingReservation = true;
  @Property({ nullable: true, type: BooleanType })
  hideOrganizationCalendar = true;
  @Property({ nullable: true, type: BooleanType })
  hideAccountNumberWhenMakingReservation = true;
  @Property({ nullable: true, type: BooleanType })
  showResourceImagesInReservation = true;
  @Property({ nullable: true, type: StringType })
  confirmationEmailWhenMakingReservation = '';
  @Property({ nullable: true, type: BooleanType })
  attachedIcsCalendarFeeds = true;
  @Property({ nullable: true, type: StringType })
  emailAddressToReceiveReservationReplyMessages = '';

  //Invoices Settings
  @Property({ nullable: true, type: BooleanType })
  membersCanEditBillingAddress = true;
  @Property({ nullable: true, type: DateType })
  defaultInvoiceDueDateUnit = new Date();
  @Property({ nullable: true, type: BooleanType })
  defaultInvoiceDueDate: number;
  @Property({ nullable: true, type: BooleanType })
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal = true;
  @Property({ nullable: true, type: BooleanType })
  lockInvoicedReservationsAndRequests = true;

  //Access Settings
  @Property({ nullable: true, type: BooleanType })
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules = true;
  @Property({ nullable: true, type: StringType })
  joinCode = '';
  @Property({ nullable: true, type: BooleanType })
  yourOrganizationWillNeverAppearInSearchResults = true;
  @Property({ nullable: true, type: BooleanType })
  notifyAdministratorsWhenMembersJoinOrganization = true;
  @Property({ nullable: true, type: BooleanType })
  listResourceToNonMembers = true;
  @Property({ nullable: true, type: StringType })
  messageSentToNewMembers = '';
}
