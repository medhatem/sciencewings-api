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
  resources: Array<ResourceBodyDTO>;
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
export class GetResourceSettingsGeneralStatusBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  statusType: string;
  @JsonProperty()
  statusDescription: string;
}

@JsonObject()
@unique
export class GetResourceSettingsGeneralStatusDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsGeneralStatusBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceSettingsGeneralStatusBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateResourceSettingsGeneralStatusDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsGeneralStatusBodyDTO;
}

@JsonObject()
@unique
export class GetResourceSettingsGeneralVisilityBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  visibility: boolean;
  @JsonProperty()
  isUnlistedOnSitePage: boolean;
  @JsonProperty()
  isUnlistedToUsersWhoCannotReserve: boolean;
  @JsonProperty()
  isFullyHiddentoUsersWhoCannotReserve: boolean;
  @JsonProperty()
  isPromotedOnSitePageAsALargeButtonAboveOtherResources: boolean;
  @JsonProperty()
  isHideAvailabilityonSitePage: boolean;
}

@JsonObject()
@unique
export class GetResourceSettingsGeneralVisilityDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsGeneralVisilityBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceSettingsGeneralVisiblityBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateResourceSettingsReservationVisiblityDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsGeneralVisiblityBodyDTO;
}

@JsonObject()
@unique
export class GetResourceSettingsGeneralPropertiesBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  accessToResource: string;
}

@JsonObject()
@unique
export class GetResourceSettingsGeneralPropertiesDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsGeneralPropertiesBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceSettingsGeneralPropertiesBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateResourceSettingsGeneralPropertiesDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsGeneralPropertiesBodyDTO;
}
