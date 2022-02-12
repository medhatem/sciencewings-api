import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
export class UserIdDTO extends BaseBodyDTO {
  @include()
  userId: number;
}

@dto()
export class ResetDTO extends BaseBodyDTO {
  @include()
  message: string;
}

@dto()
export class ErrorDTO extends BaseErrorDTO {}

@dto()
export class RegisterUserFromTokenDTO extends BaseRequestDTO {
  @include()
  body?: UserIdDTO = new UserIdDTO();

  @include()
  error?: BaseErrorDTO = new ErrorDTO();
}

@dto()
export class ResetPasswordDTO extends BaseRequestDTO {
  @include()
  body?: ResetDTO = new ResetDTO();

  @include()
  error?: BaseErrorDTO = new ErrorDTO();
}
