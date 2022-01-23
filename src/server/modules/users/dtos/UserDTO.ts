import { dto, include } from 'dto-mapper';

import { BaseDTO } from '../../base/dtos/BaseDTO';

@dto()
export class UserDTO extends BaseDTO {
  @include()
  firstname: string;

  @include()
  lastname: string;

  @include()
  email: string;

  @include()
  keycloakId: string;
}
