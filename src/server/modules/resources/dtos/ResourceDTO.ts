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
}

@JsonObject()
@unique
export class GetResourceSettingsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceSettingsBodyDTO;
}

@JsonObject()
@unique
export class UpdateResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceBodyDTO;
}
