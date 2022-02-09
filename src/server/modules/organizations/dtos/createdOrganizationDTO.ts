import { dto, include } from 'dto-mapper';
import { BaseBodyDTO, BaseRequestDTO } from '@modules/base/dtos/BaseDTO';

@dto()
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @include()
  createdOrgId: number;
}

@dto()
export class CreatedOrganizationDTO extends BaseRequestDTO {
  @include()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();
}
