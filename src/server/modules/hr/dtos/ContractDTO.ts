import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ContracBaseBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}
@JsonObject()
@unique
export class ContracBaseDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ContracBaseBodyDTO;
}
@JsonObject()
@unique
export class UpdateContracBaseDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ContracBaseBodyDTO;
}
