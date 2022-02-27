import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
class CreateMemberBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateMemberBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
