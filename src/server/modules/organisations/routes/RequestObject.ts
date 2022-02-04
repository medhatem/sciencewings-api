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
