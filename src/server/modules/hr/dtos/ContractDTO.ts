import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class ContractDTO extends BaseRequestDTO {}

@Serializable()
@unique
class CreateContracBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateContractDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateContracBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class UpdateContractDTO extends BaseRequestDTO {}
