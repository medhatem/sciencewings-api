import { BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { ErrorDTO, UserIdDTO } from '../../users/dtos/RegisterUserFromTokenDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class InviteUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
