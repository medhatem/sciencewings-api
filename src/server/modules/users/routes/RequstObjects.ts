import { dto, include } from 'dto-mapper';

@dto()
export class UserInviteToOrgRO {
  @include()
  organizationId: number;

  @include()
  email: string;
}

@dto()
export class UserPhoneRO {
  @include()
  label: string;

  @include()
  code: string;

  @include()
  number: string;

  @include()
  userId: string;
}

@dto()
export class UserDetailsRO {
  @include()
  email: string;

  @include()
  firstname: string;

  @include()
  lastname: string;

  @include()
  address: string;

  @include()
  phones: UserPhoneRO[];

  @include()
  dateofbirth: Date;

  @include()
  signature?: string;

  @include()
  actionId?: number;

  @include()
  share?: boolean;
}
export class ResetPasswordRO {
  @include()
  email: number;

  @include()
  password: string;

  @include()
  passwordConfirmation: string;
}
