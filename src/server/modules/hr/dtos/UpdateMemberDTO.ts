import { Member } from './../models/Member';
import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { Serializable } from 'typescript-json-serializer';

@Serializable()
export class UpdateMemberDTO extends BaseRequestDTO<Member> {}

  @include()
  public error?: BaseErrorDTO;
}
