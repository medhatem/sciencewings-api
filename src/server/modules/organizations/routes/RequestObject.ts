import { AddressOrganizationDTO } from '../../address/dtos/AddressDTO';
import { dto, include } from 'dto-mapper';
import { PhoneDTO } from '../../phones/dtos/PhoneDTO';

@dto()
export class CreateOrganizationRO {
  @include()
  name: string;

  @include()
  email: string;

  @include()
  phones: PhoneDTO[];

  @include()
  type: string;

  @include()
  address: AddressOrganizationDTO[];

  @include()
  labels: string[];

  @include()
  members: number[];

  @include()
  direction: number;

  @include()
  social_facebook?: string;
  @include()
  social_twitter?: string;
  @include()
  social_github?: string;
  @include()
  social_linkedin?: string;
  @include()
  social_youtube?: string;
  @include()
  social_instagram?: string;

  @include()
  adminContact: number;

  @include()
  parentId?: string;
}

@dto()
export class UserInviteToOrgRO {
  @include()
  organizationId: number;

  @include()
  email: string;
}
