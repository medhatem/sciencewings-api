import { OrganizationSocial } from './../models/OraganizationSocial';
import { OrganizationContact } from './../models/OrganizationContact';
import { OrganizationLabel } from '@modules/organisations/models/OrganizationLabel';
import { dto, include } from 'dto-mapper';
import { User } from '@modules/users/models/User';

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
  labels: string[];

  @include()
  memebers: number[];

  @include()
  contacts: { type: string; value: number }[];

  @include()
  social: { type: string; link: number }[];

  @include()
  adminContacts: { type: string; value: number }[];

  @include()
  parentId?: string;
}
