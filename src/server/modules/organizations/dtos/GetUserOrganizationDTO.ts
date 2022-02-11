import { dto, include } from 'dto-mapper';

@dto()
export class GetUserOrganizationDTO {
  @include()
  id: number;

  @include()
  name: string;
}
