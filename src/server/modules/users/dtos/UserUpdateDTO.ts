import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@modules/base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

class BodyUpdateUserDTO extends BaseBodyDTO {
  @include()
  id: number;
}

@dto()
export class UpdateUserDTO extends BaseRequestDTO {
  @include()
  public body?: BodyUpdateUserDTO;

  @include()
  public error?: BaseErrorDTO;
}
