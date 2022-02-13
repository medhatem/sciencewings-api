import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { User } from '../models';

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
export class RegisterUserFromTokenDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  body?: UserIdDTO = new UserIdDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}

@Serializable()
export class ResetPasswordDTO extends BaseRequestDTO<User> {
  @JsonProperty()
  body?: ResetDTO = new ResetDTO();

  @JsonProperty()
  error?: BaseErrorDTO = new ErrorDTO();
}
