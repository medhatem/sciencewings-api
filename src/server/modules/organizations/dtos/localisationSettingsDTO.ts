import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { timeDisplayMode, weekDay } from '../models/OrganizationSettings';

@JsonObject()
@unique
export class OrganizationLocalisationSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  addressId: number;

  @JsonProperty()
  apartment: string;

  @JsonProperty()
  street: string;

  @JsonProperty()
  city: string;

  @JsonProperty()
  country: string;

  @JsonProperty()
  province: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  weekDay: weekDay;

  @JsonProperty()
  timeDisplayMode: timeDisplayMode;
}

@JsonObject()
@unique
export class GetOrganizationLocalizationSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  data: OrganizationLocalisationSettingsBodyDTO;
}

@JsonObject()
@unique
export class GetOrganizationLoclisationSettingsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetOrganizationLocalizationSettingsBodyDTO;
}
