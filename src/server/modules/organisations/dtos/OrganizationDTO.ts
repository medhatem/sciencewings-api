import { dto, include } from 'dto-mapper';

import { BaseDTO } from '@modules/base/dtos/BaseDTO';

@dto()
export class OrganizationDTO extends BaseDTO {
  @include()
  name: string;

  @include()
  parent: any;
}
