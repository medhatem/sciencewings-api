import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';

@dto()
class BaseBodyGetDTO extends BaseBodyDTO {
  @include()
  id: number;

  @include()
  firstname: string;

  @include()
  lastname: string;

  @include()
  email: string;

  @include()
  phones: PhoneDTO[];

  @include()
  keycloakId: string;
}

@dto()
export class UserDTO extends BaseRequestDTO {
  @include()
  public body?: BaseBodyGetDTO;

  @include()
  public error?: BaseErrorDTO;
}
