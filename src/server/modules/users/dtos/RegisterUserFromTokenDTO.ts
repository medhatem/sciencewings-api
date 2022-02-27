import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/Unique';

@Serializable()
@unique
export class UserIdDTO extends BaseBodyDTO {
  @JsonProperty()
  userId: number;
}

@Serializable()
@unique
export class ResetDTO extends BaseBodyDTO {
  @JsonProperty()
  message: string;
}

@Serializable()
@unique
export class ErrorDTO extends BaseErrorDTO {}

@Serializable()
@unique
export class RegisterUserFromTokenDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}

@Serializable()
@unique
export class ResetPasswordDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: ResetDTO = new ResetDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
