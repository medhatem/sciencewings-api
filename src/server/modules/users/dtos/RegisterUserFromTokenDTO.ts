import { BaseBodyDTO, BaseDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @include()
  userId: number;
}

@dto()
export class RegisterUserFromTokenErrorDTO extends BaseErrorDTO {}

@dto()
export class RegisterUserFromTokenDTO extends BaseDTO {
  constructor() {
    super();
  }

  @include()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();

  @include()
  error?: BaseErrorDTO = new RegisterUserFromTokenErrorDTO();
}
