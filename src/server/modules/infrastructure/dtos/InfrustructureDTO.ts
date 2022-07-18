import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class InfrustructureDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class infrastructureGetDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrustructureDTO;
}

@JsonObject()
@unique
export class CreateInfrustructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrustructureDTO;
}

@JsonObject()
@unique
export class UpdateInfrustructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrustructureDTO;
}
