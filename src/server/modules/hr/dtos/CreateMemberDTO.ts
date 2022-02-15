import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { Member } from './../models/Member';

@Serializable()
class BaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateMemberDTO extends BaseRequestDTO<Member> {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
