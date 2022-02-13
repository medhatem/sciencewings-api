import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

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
