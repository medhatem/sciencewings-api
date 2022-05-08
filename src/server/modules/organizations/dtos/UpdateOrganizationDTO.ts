import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
class BodyUpdateOrganizationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class UpdateOrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BodyUpdateOrganizationDTO;
}
