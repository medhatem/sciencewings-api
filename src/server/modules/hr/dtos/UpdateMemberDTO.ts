import { Member } from './../models/Member';
import { BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class UpdateMemberDTO extends BaseRequestDTO<Member> {
  @JsonProperty()
  public error?: BaseErrorDTO;
}
