import { User } from './../../users/models/User';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { ErrorDTO, UserIdDTO } from '../../users/dtos/RegisterUserFromTokenDTO';
import { BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';

@Serializable()
export class InviteUserDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
