import { AddressOrganizationRO } from './../../base/dtos/AddressDTO';

import { dto, include } from 'dto-mapper';

@dto()
export class CreateOrganizationRO {
  @include()
  name: string;

  @include()
  email: string;

  @include()
  phone: string;

  @include()
  type: string;

  @include()
  address: AddressOrganizationRO[];

  @include()
  labels: string[];

  @include()
  members: number[];

  @include()
  direction: number;

  @include()
  social: { type: string; link: number }[];

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
