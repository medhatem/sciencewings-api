import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { beforeDeserialize } from '@/utils/utilities';

export class OrganizationLocalisationSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;

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
export class GetOrganizationLocalizationSettingsBodyDTO extends BaseBodyDTO {
  @JsonProperty({ type: OrganizationLocalisationSettingsBodyDTO, beforeDeserialize })
  data: OrganizationLocalisationSettingsBodyDTO;
}

@JsonObject()
@unique
export class GetOrganizationLoclisationSettingsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetOrganizationLocalizationSettingsBodyDTO;
}
