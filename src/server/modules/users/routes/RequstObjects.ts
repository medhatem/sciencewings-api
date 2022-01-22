import { dto, include } from 'dto-mapper';

@dto()
export class UserInviteToOrgRO {
  @include()
  organizationId: number;

  @include()
  email: string;
}
