import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ContractDTO extends BaseRequestDTO {}

@JsonObject()
@unique
class CreateContracBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateContractDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateContracBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateContractDTO extends BaseRequestDTO {}
