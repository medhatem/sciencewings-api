import { BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { ErrorDTO, UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class InviteUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
