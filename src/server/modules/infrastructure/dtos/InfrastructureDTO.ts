import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class InfrastructureDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class infrastructureGetDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrastructureDTO;
}

@JsonObject()
@unique
export class CreateInfrastructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrastructureDTO;
}

@JsonObject()
@unique
export class UpdateInfrastructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrastructureDTO;
}
