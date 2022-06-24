import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class OrganizationBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  name?: string;
}

@JsonObject()
@unique
export class OrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationBaseBodyGetDTO;
}
