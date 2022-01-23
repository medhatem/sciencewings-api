import { dto, include } from 'dto-mapper';

@dto()
export class UserInviteToOrgRO {
  @include()
  organizationId: number;

  @include()
  email: string;
}

@dto()
export class ResetPasswordRO {
  @include()
  email: number;

  @include()
  password: string;

  @include()
  passwordConfirmation: string;
}
