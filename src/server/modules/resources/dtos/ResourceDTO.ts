import { BaseBodyDTO, BaseRequestDTO, BaseDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

@Serializable()
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

@Serializable()
@unique
export class ResourceMemeberDTO extends BaseDTO {
  @JsonProperty()
  name: string;
}

@Serializable()
@unique
export class ResourceTagDTO extends BaseDTO {
  @JsonProperty()
  title: string;
}

@Serializable()
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
  })
  calendar: Array<ResourceCalendarDTO>;

  @JsonProperty({
    type: ResourceTagDTO,
  })
  tags: Array<ResourceTagDTO>;

  @JsonProperty({
    type: ResourceMemeberDTO,
  })
  managers: Array<ResourceMemeberDTO>;
}

@Serializable()
@unique
export class CreatedResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class UpdatedResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class GetResourceBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ResourceBodyDTO,
  })
  resources: Array<ResourceBodyDTO>;
}

@Serializable()
@unique
export class ResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetResourceBodyDTO;
}

@Serializable()
@unique
export class CreateResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: CreatedResourceBodyDTO;
}

@Serializable()
@unique
export class UpdateResourceDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdatedResourceBodyDTO;
}
//Resource settings
@Serializable()
@unique
export class UpdateResourceSettingsReservationGeneralBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}
@Serializable()
@unique
export class UpdateResourceSettingsReservationGeneralDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsReservationGeneralBodyDTO;
}

@Serializable()
@unique
export class UpdateResourceSettingsReservationUnitBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}
@Serializable()
@unique
export class UpdateResourceSettingsReservationUnitDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateResourceSettingsReservationUnitBodyDTO;
}
