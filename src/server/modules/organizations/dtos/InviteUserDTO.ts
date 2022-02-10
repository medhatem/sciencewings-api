import { dto, include } from 'dto-mapper';
import { ErrorDTO, UserIdDTO } from '@modules/users/dtos/RegisterUserFromTokenDTO';
import { BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';

@dto()
export class InviteUserDTO extends BaseRequestDTO {
  @include()
  body?: UserIdDTO = new UserIdDTO();

  @include()
  error?: BaseErrorDTO = new ErrorDTO();
}
