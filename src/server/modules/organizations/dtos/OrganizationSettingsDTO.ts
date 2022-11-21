import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { AccountNumberVisibilty } from '@/modules/organizations/models/OrganizationSettings';

export class OrganizationSettingsBodyDTO extends BaseBodyDTO {
  //Member Settings
  @JsonProperty()
  membersCanEditAccountNumbers: boolean;
  @JsonProperty()
  promptForAccouantNumbers: boolean;
  @JsonProperty()
  acountNumberNote: string;
  @JsonProperty()
  allowMembersToSeeAllOtherMembers: boolean;

  //Reservation Settings
  @JsonProperty()
  approversCanEditReservations: boolean;
  @JsonProperty()
  requireReasonWhenEditingReservation: boolean;
  @JsonProperty()
  hideOrganizationCalendar: boolean;
  @JsonProperty()
  hideAccountNumberWhenMakingReservation: AccountNumberVisibilty;
  @JsonProperty()
  showResourceImagesInReservation: boolean;
  @JsonProperty()
  confirmationEmailWhenMakingReservation: string;
  @JsonProperty()
  attachedIcsCalendarFeeds: boolean;
  @JsonProperty()
  emailAddressToReceiveReservationReplyMessages: string[];

  //Invoices Settings
  @JsonProperty()
  membersCanEditBillingAddress: boolean;
  @JsonProperty()
  defaultInvoiceDueDateUnit: string;
  @JsonProperty()
  defaultInvoiceDueDate: number;
  @JsonProperty()
  roundTaxOnPerItemBasisInsteadOfOnceOnSubtotal: boolean;
  @JsonProperty()
  lockInvoicedReservationsAndRequests: boolean;

  //Access Settings
  @JsonProperty()
  anyMemberCanJoinYourOrganizationAndAccessResourceSchedules: boolean;
  @JsonProperty()
  joinCode: string;
  @JsonProperty()
  yourOrganizationWillNeverAppearInSearchResults: boolean;
  @JsonProperty()
  notifyAdministratorsWhenMembersJoinOrganization: boolean;
  @JsonProperty()
  listResourceToNonMembers: boolean;
  @JsonProperty()
  messageSentToNewMembers: string;

  //localisation settings
  @JsonProperty()
  apartement: string;
  @JsonProperty()
  street: string;
  @JsonProperty()
  city: string;
  @JsonProperty()
  country: string;
  @JsonProperty()
  region: string;
  @JsonProperty()
  zipCode: string;
}

@JsonObject()
@unique
export class GetOrganizationSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty({ type: OrganizationSettingsBodyDTO, beforeDeserialize })
  data: OrganizationSettingsBodyDTO;
}

@JsonObject()
@unique
export class GetOrganizationSettingsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetOrganizationSettingsBodyDTO;
}

@JsonObject()
@unique
export class UpdateOrganizationSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateOrganizationSettingsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateOrganizationSettingsBodyDTO;
}
