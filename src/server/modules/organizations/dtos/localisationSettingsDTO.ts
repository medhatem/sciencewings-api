import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { beforeDeserialize } from '@/utils/utilities';

export class OrganizationLocalisationSettingsBodyDTO extends BaseBodyDTO {}

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
