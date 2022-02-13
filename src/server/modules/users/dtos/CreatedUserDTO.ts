import { BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { ErrorDTO, UserIdDTO } from './RegisterUserFromTokenDTO';
import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { User } from '../models';

@Serializable()
export class CreatedUserDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
