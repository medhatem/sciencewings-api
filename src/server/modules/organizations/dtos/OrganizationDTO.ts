import { dto, include } from 'dto-mapper';

import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '@modules/base/dtos/BaseDTO';
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
