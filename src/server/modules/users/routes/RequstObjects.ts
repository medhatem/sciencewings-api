import { dto, include } from 'dto-mapper';

import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';

@dto()
export class UserInviteToOrgRO {
  @include()
  organizationId: number;

  @include()
  email: string;
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
  phones: PhoneDTO[];

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
