import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

//Resource settings
@JsonObject()
@unique
export class GetResourceSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  statusType: string;
  @JsonProperty()
  statusDescription: string;

  @JsonProperty()
  visibility: boolean;
  @JsonProperty()
  isUnlistedOnOrganizationPage: boolean;
  @JsonProperty()
  isUnlistedToUsersWhoCannotReserve: boolean;
  @JsonProperty()
  isFullyHiddentoUsersWhoCannotReserve: boolean;
  @JsonProperty()
  isPromotedOnSitePageAsALargeButtonAboveOtherResources: boolean;
  @JsonProperty()
  isHideAvailabilityonSitePage: boolean;

  @JsonProperty()
  accessToResource: string;

  @JsonProperty()
  isEnabled: boolean;
  @JsonProperty()
  isLoanable: boolean;
  @JsonProperty()
  isReturnTheirOwnLoans: boolean;
  @JsonProperty()
  isReservingLoansAtFutureDates: boolean;
  @JsonProperty()
  fixedLoanDuration: string;
  @JsonProperty()
  overdueNoticeDelay: string;
  @JsonProperty()
  recurringReservations: string;

  @JsonProperty()
  unitName: string;
  @JsonProperty()
  unitLimit: number;
  @JsonProperty()
  unites: number;

  @JsonProperty()
  isEditingWindowForUsers: boolean;
  @JsonProperty()
  isRestrictCreatingNewReservationBeforeTime: boolean;
  @JsonProperty()
  isRestrictCreatingNewReservationAfterTime: boolean;
  @JsonProperty()
  reservationTimeGranularity: string;
  @JsonProperty()
  isAllowUsersToEndReservationEarly: boolean;
  @JsonProperty()
  defaultReservationDuration: string;
  @JsonProperty()
  reservationDurationMinimum: string;
  @JsonProperty()
  reservationDurationMaximum: string;
  @JsonProperty()
  bufferTimeBeforeReservation: string;

  @JsonProperty()
  isReservationDetailsVisibilityToNonModerators: boolean;
}

@JsonObject()
@unique
export class GetResourceSettingsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsBodyDTO;
}

@JsonObject()
@unique
export class resourceManagersObjectDTO extends BaseBodyDTO {
  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  data: Array<MemberDTO>;
}
@JsonObject()
@unique
export class resourceManagersRequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body: resourceManagersObjectDTO;
}
