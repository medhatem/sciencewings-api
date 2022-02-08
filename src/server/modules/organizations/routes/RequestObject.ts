import { dto, include } from 'dto-mapper';

@dto()
export class CreateOrganizationRO {
  @include()
  name: string;

  @include()
  parentId?: string;
}
