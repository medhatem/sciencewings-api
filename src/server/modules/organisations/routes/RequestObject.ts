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
  members: number[];

  @include()
  contact: number;

  @include()
  social: { type: string; link: number }[];

  @include()
  adminContact: number;

  @include()
  parentId?: string;
}
