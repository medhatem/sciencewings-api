import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
class BaseBodyGetDTO extends BaseBodyDTO {
  @include()
  id: number;
}

@dto()
export class CreateMemberDTO extends BaseRequestDTO {
  @include()
  public body?: BaseBodyGetDTO;

  @include()
  public error?: BaseErrorDTO;
}
