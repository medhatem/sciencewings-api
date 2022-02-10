import { dto, include } from 'dto-mapper';
import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@modules/base/dtos/BaseDTO';

@dto()
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @include()
  id: number;
}

@dto()
export class CreateOrganizationDTO extends BaseRequestDTO {
  @include()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();

  @include()
  public error?: BaseErrorDTO;
}
