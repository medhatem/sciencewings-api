import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class InfrustructureDTO extends BaseRequestDTO {}

@JsonObject()
@unique
export class InfrustructureBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateInfrustructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrustructureBaseBodyGetDTO;
}
@JsonObject()
@unique
export class UpdateInfrustructureBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}
export class UpdateInfrustructureDTO extends BaseRequestDTO {
  @JsonProperty()
  body: UpdateInfrustructureBodyDTO;
}
