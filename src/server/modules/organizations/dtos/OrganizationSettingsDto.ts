import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { beforeDeserialize } from '@/utils/utilities';

export class OrganizationSettingsBodyDTO extends BaseBodyDTO {
  //Reservation Settings
  @JsonProperty()
  approversCanEditReservations: boolean;
  @JsonProperty()
  requireReasonWhenEditingReservation: boolean;
  @JsonProperty()
  hideOrganizationCalendar: boolean;
  @JsonProperty()
  hideAccountNumberWhenMakingReservation: boolean;
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
