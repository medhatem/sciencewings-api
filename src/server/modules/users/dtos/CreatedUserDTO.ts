import { ErrorDTO, UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { User } from '../models';

@Serializable()
export class CreatedUserDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
