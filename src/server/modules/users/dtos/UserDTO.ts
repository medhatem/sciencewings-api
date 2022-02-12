import { dto, include } from 'dto-mapper';
import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { Phone } from '../../phones/models';
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
  phones: Phone[];

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
