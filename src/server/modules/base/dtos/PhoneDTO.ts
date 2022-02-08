import { dto, include } from 'dto-mapper';

@dto()
export class PhoneRO {
  @include()
  label: string;

  @include()
  code: string;

  @include()
  number: string;

  @include()
  userId?: number;

  @include()
  organizationId?: number;
}
