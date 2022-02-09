import { ErrorDTO, UserIdDTO } from './RegisterUserFromTokenDTO';
import { dto, include } from 'dto-mapper';

import { BaseErrorDTO } from './../../base/dtos/BaseDTO';
import { BaseRequestDTO } from '@modules/base/dtos/BaseDTO';

@dto()
export class CreatedUserDTO extends BaseRequestDTO {
  @include()
  body?: UserIdDTO = new UserIdDTO();

  @include()
  error?: BaseErrorDTO = new ErrorDTO();
}
