import { BaseBodyDTO, BaseDTO } from '@modules/base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @include()
  createdOrgId: number;
}

@dto()
export class CreatedOrganizationDTO extends BaseDTO {
  @include()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();
}
