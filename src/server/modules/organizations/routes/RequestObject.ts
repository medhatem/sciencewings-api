import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class CreateOrganizationRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  email: string;

  @JsonProperty({
    type: PhoneRO,
  })
  phones?: Array<PhoneRO>;
  @JsonProperty()
  type: string;

  @JsonProperty({
    type: AddressRO,
  })
  addresses?: Array<AddressRO>;

  @JsonProperty()
  labels: Array<string>;

  @JsonProperty()
  members: Array<number>;

  @JsonProperty()
  socialFacebook?: string;
  @JsonProperty()
  socialTwitter?: string;
  @JsonProperty()
  socialGithub?: string;
  @JsonProperty()
  socialLinkedin?: string;
  @JsonProperty()
  socialYoutube?: string;
  @JsonProperty()
  socialInstagram?: string;

  @JsonProperty()
  parent?: number;
}

@JsonObject()
@unique
export class UpdateOrganizationRO {
  @JsonProperty()
  name?: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  email?: string;

  @JsonProperty()
  type?: string;

  @JsonProperty()
  labels?: Array<string>;

  @JsonProperty()
  owner?: number;

  @JsonProperty()
  socialFacebook?: string;
  @JsonProperty()
  socialTwitter?: string;
  @JsonProperty()
  socialGithub?: string;
  @JsonProperty()
  socialLinkedin?: string;
  @JsonProperty()
  socialYoutube?: string;
  @JsonProperty()
  socialInstagram?: string;

  @JsonProperty()
  parent?: number;
}

@JsonObject()
@unique
export class UserInviteToOrgRO {
  @JsonProperty()
  organizationId: number;

  @JsonProperty()
  email: string;
}
@JsonObject()
@unique
export class UserResendPassword {
  @JsonProperty()
  userId: number;

  @JsonProperty()
  orgId: number;
}
@JsonObject()
@unique
export class OrganizationMemberSettingsRO {
  @JsonProperty()
  membersCanEditAccountNumbers: boolean;
  @JsonProperty()
  promptForAccouantNumbers: boolean;
  @JsonProperty()
  acountNumberNote: string;
  @JsonProperty()
  allowMembersToSeeAllOtherMembers: boolean;
}

@JsonObject()
@unique
export class OrganizationReservationSettingsRO {
  @JsonProperty()
  approversCanEditReservations?: boolean;
  @JsonProperty()
  requireReasonWhenEditingReservation?: boolean;
  @JsonProperty()
  hideOrganizationCalendar?: boolean;
  @JsonProperty()
  hideAccountNumberWhenMakingReservation?: boolean;
  @JsonProperty()
  showResourceImagesInReservation?: boolean;
  @JsonProperty()
  confirmationEmailWhenMakingReservation?: string;
  @JsonProperty()
  attachedIcsCalendarFeeds?: boolean;
  @JsonProperty()
  emailAddressToReceiveReservationReplyMessages?: string[];
}

@JsonObject()
@unique
export class OrganizationInvoicesSettingsRO {
  @JsonProperty()
  membersCanEditBillingAddress?: boolean;
  @JsonProperty()
  defaultInvoiceDueDateUnit?: string;
  @JsonProperty()
  defaultInvoiceDueDate?: number;
  @JsonProperty()
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal?: boolean;
  @JsonProperty()
  lockInvoicedReservationsAndRequests?: boolean;
}

@JsonObject()
@unique
export class OrganizationAccessSettingsRO {
  @JsonProperty()
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules?: boolean;
  @JsonProperty()
  joinCode?: string;
  @JsonProperty()
  yourOrganizationWillNeverAppearInSearchResults?: boolean;
  @JsonProperty()
  notifyAdministratorsWhenMembersJoinOrganization?: boolean;
  @JsonProperty()
  listResourceToNonMembers?: boolean;
  @JsonProperty()
  messageSentToNewMembers?: string;
}
