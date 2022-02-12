import { BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { ErrorDTO, UserIdDTO } from './RegisterUserFromTokenDTO';
import { BaseRequestDTO } from '../../base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
export class CreatedUserDTO extends BaseRequestDTO {
  @include()
  body?: UserIdDTO = new UserIdDTO();

  @include()
  error?: BaseErrorDTO = new ErrorDTO();
}
