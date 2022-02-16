import { ErrorDTO, UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';

@Serializable()
export class CreatedUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
