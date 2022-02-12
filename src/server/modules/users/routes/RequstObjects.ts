import { PhoneDTO } from '../../phones/dtos/PhoneDTO';
import { dto, include } from 'dto-mapper';

@dto()
export class KeycloakIdRO {
  @include()
  keycloakId: string;
}

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
