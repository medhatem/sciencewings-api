import { dto, include } from 'dto-mapper';

@dto()
export class CreateOrganisationRO {
  @include()
  name: string;
}
