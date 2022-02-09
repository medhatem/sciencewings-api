import { BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';
import { ErrorDTO, UserIdDTO } from '../../users/dtos/RegisterUserFromTokenDTO';

@dto()
export class InviteUserDTO extends BaseRequestDTO {
  @include()
  body?: UserIdDTO = new UserIdDTO();

  @include()
  error?: BaseErrorDTO = new ErrorDTO();
}
