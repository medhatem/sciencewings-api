import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class CreatedUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO;

  @JsonProperty()
  error?: BaseErrorDTO;
}
