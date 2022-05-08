import { BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class InviteUserDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();
}
