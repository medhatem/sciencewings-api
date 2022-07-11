import { BaseBodyDTO, BaseDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';
import { OrganizationInformationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { UserDTO } from '@/modules/users/dtos/UserDTO';

@JsonObject()
@unique
export class ResourceCalendarDTO extends BaseBodyDTO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  hoursPerDay?: number;

  @JsonProperty()
  timezone: string;

  @JsonProperty()
  twoWeeksCalendar: boolean;
}

@JsonObject()
@unique
export class ResourceManagerDTO extends BaseDTO {
  @JsonProperty()
  user: UserDTO;

  @JsonProperty()
  organization: OrganizationInformationDTO;

  @JsonProperty()
  name: string;
}

@JsonObject()
@unique
export class ResourceTagDTO extends BaseDTO {
  @JsonProperty()
  title: string;
}

@JsonObject()
@unique
export class ResourceDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  resourceType!: string;

  @JsonProperty()
  resourceClass!: string;

  @JsonProperty()
  user: number;

  @JsonProperty()
  timezone: string;

  @JsonProperty({
    type: ResourceCalendarDTO,
    beforeDeserialize,
  })
  calendar: Array<ResourceCalendarDTO>;

  @JsonProperty({
    type: ResourceTagDTO,
    beforeDeserialize,
  })
  tags: Array<ResourceTagDTO>;

  @JsonProperty({
    type: ResourceManagerDTO,
    beforeDeserialize,
  })
  managers: Array<ResourceManagerDTO>;
}

@JsonObject()
@unique
export class CreatedResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class GetResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ResourceDTO,
    beforeDeserialize,
  })
  data: Array<ResourceDTO>;
}

@JsonObject()
@unique
export class ResourceGetDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceBodyDTO;
}

@JsonObject()
@unique
export class CreateResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: CreatedResourceBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class GetResourceReservationVisibilityBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  isReservationDetailsVisibilityToNonModerators: string;
}

@JsonObject()
@unique
export class GetResourceReservationVisibilityDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceReservationVisibilityBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceBodyDTO;
}

//Resource settings
@JsonObject()
@unique
export class GetResourceSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  resourceType: string;
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
