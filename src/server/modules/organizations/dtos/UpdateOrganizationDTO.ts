import { dto, include } from 'dto-mapper';
import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';

class BodyUpdateOrganizationDTO extends BaseBodyDTO {
  @include()
  id: number;
}

@dto()
export class UpdateOrganizationDTO extends BaseRequestDTO {
  @include()
  public body?: BodyUpdateOrganizationDTO;

  @include()
  public error?: BaseErrorDTO;
}
