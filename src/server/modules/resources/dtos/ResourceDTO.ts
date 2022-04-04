import { BaseBodyDTO, BaseDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

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
export class ResourceMemeberDTO extends BaseDTO {
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
export class ResourceBodyDTO extends BaseBodyDTO {
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
    type: ResourceMemeberDTO,
    beforeDeserialize,
  })
  managers: Array<ResourceMemeberDTO>;
}

@JsonObject()
@unique
export class CreatedResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdatedResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class GetResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ResourceBodyDTO,
    beforeDeserialize,
  })
  data: Array<ResourceBodyDTO>;
}

@JsonObject()
@unique
export class ResourceDTO extends BaseRequestDTO {
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
export class UpdateResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdatedResourceBodyDTO;
}

//Resource settings
@JsonObject()
@unique
export class GetResourceSettingsReservationGeneralBodyDTO extends BaseBodyDTO {
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
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationGeneralBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class GetResourceSettingsReservationGeneralDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsReservationGeneralBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationGeneralDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsReservationGeneralBodyDTO;
}

@JsonObject()
@unique
export class GetResourceSettingsReservationUnitBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  unitName: string;
  @JsonProperty()
  unitLimit: number;
  @JsonProperty()
  unites: number;
}

@JsonObject()
@unique
export class GetResourceSettingsReservationUnitDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsReservationUnitBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationUnitBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationUnitDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsReservationUnitBodyDTO;
}

@JsonObject()
@unique
export class GetResourceSettingsReservationTimeRestrictionBodyDTO extends BaseBodyDTO {
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
}

@JsonObject()
@unique
export class GetResourceSettingsReservationTimeRestrictionDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsReservationTimeRestrictionBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationTimeRestrictionBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationTimeRestrictionDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsReservationTimeRestrictionBodyDTO;
}
