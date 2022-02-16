import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class UserIdDTO extends BaseBodyDTO {
  @JsonProperty()
  userId: number;
}

@Serializable()
export class ResetDTO extends BaseBodyDTO {
  @JsonProperty()
  message: string;
}

@Serializable()
export class ErrorDTO extends BaseErrorDTO {}

@Serializable()
export class RegisterUserFromTokenDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}

@Serializable()
export class ResetPasswordDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: ResetDTO = new ResetDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
