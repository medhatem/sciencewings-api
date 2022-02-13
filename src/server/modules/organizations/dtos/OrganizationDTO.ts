import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { dto, include } from 'dto-mapper';

@dto()
class BaseBodyGetDTO extends BaseBodyDTO {
  @include()
  id: number;

  @include()
  name: string;

  @include()
  parent: any;
}

@dto()
export class OrganizationDTO extends BaseRequestDTO {
  @include()
  public body?: BaseBodyGetDTO;

  @include()
  public error?: BaseErrorDTO;
}
