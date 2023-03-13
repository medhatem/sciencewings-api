import { BaseBodyDTO, BaseDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';
import { OrganizationInformationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { UserDTO } from '@/modules/users/dtos/UserDTO';
import { PaginationBodyDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';
import { GetResourceSettingsBodyDTO } from '@/modules/resources/dtos/ResourceSettingsDTO';
import { ResourceStatusDTO } from '@/modules/resources/dtos/ResourceStatusDTO';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';

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
export class ResourceDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  organization: OrganizationInformationDTO;

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

  @JsonProperty()
  settings: GetResourceSettingsBodyDTO;

  @JsonProperty()
  status: ResourceStatusDTO;

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
    type: MemberDTO,
    beforeDeserialize,
  })
  managers: Array<MemberDTO>;
}

@JsonObject()
@unique
export class CreatedResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class GetResourcesBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ResourceDTO,
    beforeDeserialize,
  })
  data: ResourceDTO[];

  @JsonProperty()
  pagination?: PaginationBodyDTO;
}

@JsonObject()
@unique
export class ResourcesGetDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourcesBodyDTO;
}

@JsonObject()
@unique
export class ResourceGetDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ResourceDTO;
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
