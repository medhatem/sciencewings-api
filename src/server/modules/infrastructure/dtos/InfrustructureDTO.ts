import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
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

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateInfrustructureDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: InfrustructureBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
