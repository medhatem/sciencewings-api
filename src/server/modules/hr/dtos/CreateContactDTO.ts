import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { Contract } from '../models/Contract';

@Serializable()
class BaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateContractDTO extends BaseRequestDTO<Contract> {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
