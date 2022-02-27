import { ErrorDTO, UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { unique } from '@/decorators/Unique';

@Serializable()
@unique
export class CreatedUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
